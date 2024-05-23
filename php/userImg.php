<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');

if (isset($_FILES['Img']) && $_SERVER['REQUEST_METHOD'] === "POST") {
    $nickname = $_POST['nickname'];
    $file = $_FILES['Img'];

    // 디렉토리와 파일명 설정
    $uploadDirectory = "/var/www/html/music-app/build/userImg/";
    $filename = $file['name'];
    $filepath = $uploadDirectory . $filename;
    $uploadPath = "/userImg/".$filename;

    // 파일을 지정된 디렉토리에 저장
    if ($_FILES['Img']['error'] === UPLOAD_ERR_OK && move_uploaded_file($_FILES['Img']['tmp_name'], $filepath)) {
        // 데이터베이스에 파일 경로 저장
        $host = 'localhost';
        $user = 'violet';
        $pw = 'violet123';
        $dbName = 'music';

        $conn = mysqli_connect($host, $user, $pw, $dbName);
        if (!$conn) {
            die("접속 실패: " . $conn->connect_error);
        }

        $sql = "UPDATE user SET img_route = '$uploadPath' WHERE nickname = '$nickname'";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $result_response = json_encode(["status" => "success", "message" => "Image uploaded and saved.", 'response' => 200]);
        } else {
            $result_response = json_encode(["status" => "fail", "message" => "Failed to update database.", 'response' => 400]);
        }
    } elseif ($_FILES['Img']['error'] !== UPLOAD_ERR_OK) {
        $error_code = $_FILES['Img']['error'];
        $error_message = "File upload error. Error code: " . $error_code;
        $result_response = json_encode(["status" => "fail", "message" => $error_message, 'response' => 400]);
    } else {
        $result_response = json_encode(["status" => "fail", "message" => "Unknown error occurred during file upload.", 'response' => 400]);
    }

    echo $result_response;
}
?>