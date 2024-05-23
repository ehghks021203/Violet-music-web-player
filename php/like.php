<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header('Content-Type: application/json');


    if(isset($_POST) && $_SERVER['REQUEST_METHOD'] == "POST") {     // 비정상 접속을 막기 위함 (POST로 접속 시 데이터 전송)
        $_POST = json_decode(file_get_contents("php://input"),true); 
        @extract($_POST); // $_POST['loginID'] 라고 쓰지 않고, $loginID 라고 써도 인식되게 함
        $host = 'localhost';
        $user = 'violet';
        $pw = 'violet123';
        $dbName = 'music';

        $conn = mysqli_connect($host, $user, $pw, $dbName);
        if(!$conn){
            die("접속 실패: ". $conn->connect_error);
        }
        // title로 song 테이블에서 song.no 가져오기
        $sqlSong = "SELECT no FROM song WHERE title = '$title'";
        $resultSong = mysqli_query($conn, $sqlSong);
        $rowSong = mysqli_fetch_assoc($resultSong);
        $songNo = $rowSong['no'];

        // email로 user 테이블에서 user.no 가져오기
        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];
        
        $ifsql = "SELECT *
        FROM mlike
        WHERE user_no = '$userNo' AND song_no = '$songNo' AND mlike = '0'";
        $resultIfsql = mysqli_query($conn, $ifsql);
        $row = mysqli_fetch_all($resultIfsql, MYSQLI_ASSOC);
        if($row == null){
            $sql = "INSERT INTO mlike (user_no, song_no, mlike) VALUES ('$userNo', '$songNo','1')";
            $resultInsert = mysqli_query($conn, $sql);
            if ($resultInsert) {
            // 삽입 성공
            $result_response = json_encode(["status" => "success", "message" => "insert success", 'response' => 200]);
            }
            else{
                $result_response = json_encode(["status" => "fail", "message" => $songNo, 'response' => 400]);
            }
        }else {
            // 삽입 실패
            $sql = "UPDATE mlike SET mlike = '1' WHERE user_no = '$userNo' AND song_no = '$songNo' AND mlike = '0'";
            $resultInsert2 = mysqli_query($conn, $sql);
            if($resultInsert2)
            {
                $result_response = json_encode(["status" => "success", "message" => "update success", 'response' => 200]);
            }else{
            $result_response = json_encode(["status" => "fail", "message" => $songNo, 'response' => 400]);
            }
        }
        echo $result_response;
    }
?>