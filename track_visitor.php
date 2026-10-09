<?php
/**
 * VISITOR GEOLOCATION TRACKER ENGINE
 * Portofolio Farrij - Auto Log & Notification
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -------------------------------------------------------------
// KONFIGURASI NOTIFIKASI:
// -------------------------------------------------------------
$TARGET_EMAIL        = "contact.farrij@gmail.com"; // Email resmi dari portofolio Farrij
$DISCORD_WEBHOOK_URL = ""; // Opsional: Contoh "https://discord.com/api/webhooks/xxxx/yyyy"
$TELEGRAM_BOT_TOKEN  = ""; // Opsional: Contoh "123456789:ABCDefgh..."
$TELEGRAM_CHAT_ID    = ""; // Opsional: Contoh "12345678"

// Tangkap IP Asli dari Request
function getClientIP() {
    $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ips = explode(',', $_SERVER[$key]);
            return trim($ips[0]);
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = [];
}

$ip = !empty($data['ip']) ? $data['ip'] : getClientIP();
$isGps = !empty($data['is_gps']);
$accuracy = !empty($data['accuracy']) ? round($data['accuracy']) : null;
$city = $data['city'] ?? '';
$region = $data['region'] ?? '';
$country = $data['country'] ?? '';
$isp = $data['isp'] ?? $data['org'] ?? '';
$lat = $data['latitude'] ?? $data['lat'] ?? null;
$lon = $data['longitude'] ?? $data['lon'] ?? null;
$locality = $data['locality'] ?? '';

// Jika data IP belum lengkap dan bukan GPS, lakukan lookup server-side via ipwho.is
if (!$isGps && (empty($city) || $city === 'Tidak Diketahui' || empty($isp) || $isp === 'Unknown ISP')) {
    $lookupIp = ($ip === '::1' || $ip === '127.0.0.1' || strpos($ip, '192.168.') === 0) ? '' : $ip;
    $lookupUrl = "https://ipwho.is/" . $lookupIp;
    $ctx = stream_context_create(['http' => ['timeout' => 3]]);
    $resp = @file_get_contents($lookupUrl, false, $ctx);
    if ($resp) {
        $ipObj = json_decode($resp, true);
        if (!empty($ipObj) && !empty($ipObj['success'])) {
            if ($ip === '::1' || $ip === '127.0.0.1' || strpos($ip, '192.168.') === 0) {
                $ip = $ipObj['ip'] ?? $ip;
            }
            $city = $city ?: ($ipObj['city'] ?? 'Tidak Diketahui');
            $region = $region ?: ($ipObj['region'] ?? '');
            $country = $country ?: ($ipObj['country'] ?? 'Indonesia');
            $isp = (!empty($ipObj['connection']['org'])) ? $ipObj['connection']['org'] : ($ipObj['connection']['isp'] ?? 'ISP');
            if (!$lat && !$lon && !empty($ipObj['latitude'])) {
                $lat = $ipObj['latitude'];
                $lon = $ipObj['longitude'];
            }
        }
    }
}

$city = $city ?: 'Tidak Diketahui';
$country = $country ?: 'Indonesia';
$isp = $isp ?: 'Unknown ISP';

$mapsLink = ($lat && $lon) ? "https://www.google.com/maps?q={$lat},{$lon}" : "-";
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? ($data['userAgent'] ?? 'Unknown UA');
$referer = $_SERVER['HTTP_REFERER'] ?? ($data['referrer'] ?? 'Langsung / Direct');
$screen = $data['screen'] ?? '-';
$timestamp = date('Y-m-d H:i:s');

// Format label lokasi yang transparan & jelas
if ($isGps) {
    $fullAddress = !empty($data['full_address']) 
        ? $data['full_address'] 
        : trim(($locality ? "{$locality}, " : "") . "{$city}, {$region}, {$country}", ', ') . " (±{$accuracy}m)";
    $trackingMode = "GPS Hardware Satelit (Presisi Tinggi)";
    $accuracyLabel = "±{$accuracy}m (Akurat)";
} else {
    $cleanCityRegion = trim("{$city}, {$region}, {$country}", ', ');
    $fullAddress = "[Estimasi ISP] " . ($cleanCityRegion ?: 'Indonesia');
    $trackingMode = "Estimasi Gateway Jaringan ISP (Radius Kota ±10-50km)";
    $accuracyLabel = "Estimasi ISP (±25km)";
}

// Ekstrak Spesifikasi Perangkat Lengkap
$deviceType  = $data['deviceType'] ?? $data['device_type'] ?? 'Desktop/Smartphone';
$deviceModel = $data['deviceModel'] ?? $data['device_model'] ?? $deviceType;
$os          = $data['os'] ?? 'Unknown OS';
$browser     = $data['browser'] ?? 'Unknown Browser';
$cpu         = $data['cpuCores'] ?? $data['cpu_cores'] ?? 'N/A';
$ram         = $data['ramGb'] ?? $data['ram'] ?? 'N/A';
$gpu         = $data['gpu'] ?? 'N/A';
$battery     = $data['battery'] ?? 'N/A';
$network     = $data['network'] ?? 'N/A';
$screenSpec  = $data['screenSpec'] ?? $data['screen'] ?? $screen;
$coordsText  = ($lat && $lon) ? "{$lat}, {$lon}" : ($data['coords'] ?? '-');

$record = [
    'timestamp'     => $timestamp,
    'ip'            => $ip,
    'is_gps'        => $isGps,
    'tracking_mode' => $trackingMode,
    'accuracy'      => $accuracyLabel,
    'accuracy_num'  => $accuracy,
    'latitude'      => $lat,
    'longitude'     => $lon,
    'coords'        => $coordsText,
    'maps_link'     => $mapsLink,
    'city'          => $city,
    'locality'      => $locality,
    'region'        => $region,
    'country'       => $country,
    'location'      => $fullAddress,
    'isp'           => $isp,
    'device_type'   => $deviceType,
    'device_model'  => $deviceModel,
    'os'            => $os,
    'browser'       => $browser,
    'cpu'           => $cpu,
    'ram'           => $ram,
    'gpu'           => $gpu,
    'screen'        => $screenSpec,
    'battery'       => $battery,
    'network'       => $network,
    'user_agent'    => $userAgent,
    'referer'       => $referer
];

// Simpan ke file log JSON
$logFile = __DIR__ . '/visitors_log.json';
$existingLogs = [];
if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    $existingLogs = json_decode($content, true) ?: [];
}

// Jika ini update GPS dari pengunjung yang sama (IP sama dalam 10 menit terakhir), perbarui entri teratas
$updatedExisting = false;
if (!empty($existingLogs)) {
    foreach ($existingLogs as $idx => $prev) {
        if (($prev['ip'] === $ip) && (strtotime($timestamp) - strtotime($prev['timestamp']) < 600)) {
            // Jika sebelumnya IP estimate dan sekarang dapat GPS, timpa dengan data GPS
            if ($isGps || empty($prev['is_gps'])) {
                $existingLogs[$idx] = array_merge($prev, $record);
                $updatedExisting = true;
                break;
            }
        }
    }
}

if (!$updatedExisting) {
    array_unshift($existingLogs, $record);
}

if (count($existingLogs) > 500) {
    $existingLogs = array_slice($existingLogs, 0, 500);
}
@file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

// Kirim ke Discord Webhook jika diisi
if (!empty($DISCORD_WEBHOOK_URL)) {
    $embedTitle = $isGps ? "🎯 PENGUNJUNG TERLACAK (GPS PRESISI TINGGI ±{$accuracy}m)!" : "🚨 PENGUNJUNG TERLACAK DI PORTOFOLIO!";
    $embedColor = $isGps ? 0x00FF88 : 0x00F0FF;
    $embed = [
        "title" => $embedTitle,
        "color" => $embedColor,
        "fields" => [
            ["name" => "🌐 IP Address", "value" => "`{$ip}`", "inline" => true],
            ["name" => "📍 Lokasi Real-Time", "value" => "{$record['location']}", "inline" => true],
            ["name" => "📌 Titik Koordinat", "value" => "`{$coordsText}` (±" . ($accuracy ? "{$accuracy}m" : "Perkiraan IP") . ")", "inline" => true],
            ["name" => "🗺️ Peta Google Maps", "value" => "[Buka Titik Peta Google Maps]({$mapsLink})", "inline" => false],
            ["name" => "📱 Perangkat & OS", "value" => "{$deviceModel} · {$os}", "inline" => true],
            ["name" => "🌐 Browser", "value" => "{$browser}", "inline" => true],
            ["name" => "🧠 CPU / RAM", "value" => "{$cpu} · {$ram}", "inline" => true],
            ["name" => "🎮 Kartu Grafis / GPU", "value" => "{$gpu}", "inline" => false],
            ["name" => "🔋 Baterai & Layar", "value" => "{$battery} · {$screenSpec}", "inline" => true],
            ["name" => "📡 Jaringan & ISP", "value" => "{$network} ({$isp})", "inline" => true],
            ["name" => "⏰ Waktu Akses", "value" => "{$timestamp} WIB", "inline" => true],
        ],
        "footer" => ["text" => "Zero-Gravity High-Precision Telemetry"]
    ];

    $payload = json_encode(["embeds" => [$embed]]);
    @file_get_contents($DISCORD_WEBHOOK_URL, false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\n",
            'content' => $payload,
            'timeout' => 3
        ]
    ]));
}

// Kirim ke Telegram Bot jika diisi
if (!empty($TELEGRAM_BOT_TOKEN) && !empty($TELEGRAM_CHAT_ID)) {
    $headerTxt = $isGps ? "🎯 *LOKASI GPS PRESISI TINGGI (±{$accuracy}m)*" : "🚨 *PENGUNJUNG TERLACAK*";
    $msg = "{$headerTxt}\n\n"
         . "🌐 *IP:* `{$ip}`\n"
         . "📍 *Lokasi:* {$record['location']}\n"
         . "📌 *Koordinat:* `{$coordsText}`\n"
         . "🗺️ *Maps:* {$mapsLink}\n"
         . "📱 *Perangkat:* {$deviceModel} ({$os})\n"
         . "🧠 *Hardware:* {$cpu} | {$ram}\n"
         . "🎮 *GPU:* {$gpu}\n"
         . "🔋 *Baterai:* {$battery}\n"
         . "📡 *ISP:* {$isp}\n"
         . "⏰ *Waktu:* {$timestamp} WIB";

    $tgUrl = "https://api.telegram.org/bot{$TELEGRAM_BOT_TOKEN}/sendMessage";
    $tgData = [
        'chat_id' => $TELEGRAM_CHAT_ID,
        'text' => $msg,
        'parse_mode' => 'Markdown'
    ];
    @file_get_contents($tgUrl, false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($tgData),
            'timeout' => 3
        ]
    ]));
}

// Kirim ke Email resmi Farrij (contact.farrij@gmail.com) jika mail() tersedia
if (!empty($TARGET_EMAIL)) {
    $mailPrefix = $isGps ? "🎯 [LOKASI GPS SANGAT AKURAT (±{$accuracy}m)]" : "🚨 [Radar Portofolio]";
    $subject = "{$mailPrefix} {$deviceType} di " . ($record['location'] ?: 'Lokasi Tidak Diketahui');
    $mailBody = "Pengunjung membuka portofolio Farrij:\n\n"
              . "Tipe Pelacakan : " . ($isGps ? "GPS Hardware Satelit (Akurasi ±{$accuracy}m)" : "IP Network Geolocation") . "\n"
              . "📌 Titik Koordinat: {$coordsText}\n"
              . "📍 Lokasi Real    : {$record['location']}\n"
              . "🗺️ Google Maps    : {$mapsLink}\n\n"
              . "--- SPESIFIKASI PERANGKAT LENGKAP ---\n"
              . "📱 Model Perangkat: {$deviceModel}\n"
              . "💻 Sistem Operasi : {$os}\n"
              . "🌐 Browser        : {$browser}\n"
              . "🧠 Processor CPU  : {$cpu}\n"
              . "💾 Memory RAM     : {$ram}\n"
              . "🎮 Kartu Grafis   : {$gpu}\n"
              . "🖥️ Resolusi Layar : {$screenSpec}\n"
              . "🔋 Status Baterai : {$battery}\n"
              . "📡 Jaringan / Net : {$network}\n\n"
              . "🌐 IP Address     : {$ip}\n"
              . "🏢 Provider / ISP : {$isp}\n"
              . "⏰ Waktu Akses    : {$timestamp} WIB\n"
              . "🔗 Referrer       : {$referer}\n";
    $headers = "From: Telemetry Radar <telemetry@farrij.portfolio>\r\n"
             . "Reply-To: no-reply@farrij.portfolio\r\n"
             . "X-Mailer: PHP/" . phpversion();
    @mail($TARGET_EMAIL, $subject, $mailBody, $headers);
}

echo json_encode([
    'status'  => 'success',
    'message' => 'Visitor location logged successfully',
    'tracked' => $record
]);
