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
        
        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];

        $sqlSong = "SELECT no FROM song WHERE title = '$title'";
        $resultSong = mysqli_query($conn, $sqlSong);
        $rowSong = mysqli_fetch_assoc($resultSong);
        $songNo = $rowSong['no'];

        $sqlCheck = "SELECT * FROM streaming WHERE user_no = $userNo AND song_no = $songNo";
        $resultCheck = mysqli_query($conn, $sqlCheck);

        if (mysqli_num_rows($resultCheck) > 0) {
            $clickdate = date('Y-m-d H:i:s');
            // 이미 데이터가 존재하는 경우 clickout 업데이트
            $sqlUpdate = "UPDATE streaming SET clickcount = clickcount + 1, clickdate = '$clickdate' WHERE user_no = $userNo AND song_no = $songNo";
            $resultUpdate = mysqli_query($conn, $sqlUpdate);

            if ($resultUpdate) {
                // 업데이트 성공
                $result_response = json_encode(["status" => "success", "message" => "Clickout updated", 'response' => 200]);
            } else {
                // 업데이트 실패
                $result_response = json_encode(["status" => "fail", "message" => "Failed to update clickcount", 'response' => 400]);
            }
        } else {
            // 데이터가 존재하지 않는 경우 새로운 데이터 삽입
            $clickdate = date('Y-m-d H:i:s');// 현재 시간
            $clickcount = 1;

            $sqlInsert = "INSERT INTO streaming (user_no, song_no, clickdate, clickcount) VALUES ($userNo, $songNo, '$clickdate', $clickcount)";
            $resultInsert = mysqli_query($conn, $sqlInsert);

            if ($resultInsert) {
                // 삽입 성공
                $result_response = json_encode(["status" => "success", "message" => "Data inserted", 'response' => 200]);
            } else {
                // 삽입 실패
                $result_response = json_encode(["status" => "fail", "message" => "Failed to insert data", 'response' => 400]);
            }
        }
        echo $result_response;
    }
?>