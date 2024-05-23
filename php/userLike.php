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

        $sqlUser = "SELECT no FROM user WHERE nickname = '$nickname'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];

        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo2 = $rowUser['no'];
        
        $sql = "SELECT * FROM mlike WHERE user_no = '$userNo' AND mlike='1'";
        $resultMlike = mysqli_query($conn, $sql);

 

        if (mysqli_num_rows($resultMlike) > 0) {
            $songNos = array(); // song_no 값을 저장할 배열 선언
        
            while ($rowMlike = mysqli_fetch_assoc($resultMlike)) {
                $songNo = $rowMlike['song_no'];
                $songNos[] = $songNo; // song_no 값을 배열에 추가
            }
        
            // song_no 값을 콤마로 구분하여 문자열로 변환
            $songNosString = implode(',', $songNos);

            $sqlMlike = "SELECT song.no, IFNULL(mlike.mlike, 0) AS mlike
            FROM song
            LEFT JOIN mlike ON song.no = mlike.song_no AND mlike.user_no = '$userNo2'
            WHERE song.no IN ($songNosString)";
            $resultMlike2 = mysqli_query($conn, $sqlMlike);       

            $sqlSong = "SELECT distinct song.no, song.title, song.genre, song.mp3_route, artist.artist, album.album, album.reldate, album.img_route, mlike.mlike
            FROM song
            INNER JOIN artist ON song.artist_no = artist.no
            INNER JOIN album ON song.album_no = album.no
            LEFT JOIN mlike ON song.no = mlike.song_no AND mlike.mlike = 1
            WHERE song.no IN ($songNosString)";

            $resultSong = mysqli_query($conn, $sqlSong);
            $rows = mysqli_fetch_all($resultSong, MYSQLI_ASSOC);
            $rowsMlike = mysqli_fetch_all($resultMlike2, MYSQLI_ASSOC);

            foreach ($rows as &$row) {
                foreach ($rowsMlike as $mlike) {
                    if ($row['no'] === $mlike['no']) {
                        $row['mlike'] = $mlike['mlike'];
                        break;
                    }
                }
            }
        }
        // 조회 결과 확인 
        if ($row != null) {
            // 조회 성공
            $result_response = json_encode(["status" => "success", "message" => $rows, 'response' => 200]);
        } else {
            // 조회 실패
            $result_response = json_encode(["status" => "fail", "message" => "fail", 'response' => 400]);
        }
        echo $result_response;
    }
?>