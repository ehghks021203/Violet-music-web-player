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

        if ($type == "add") {
            $sql = "SELECT * FROM playlist WHERE no='$playlist_no'";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_array($result);
            if ($row['img_route'] == null) {
                $sql = "SELECT album.img_route FROM song
                    INNER JOIN album ON song.album_no=album.no
                    WHERE song.no='$song_no'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_array($result);
                $img_route = $row['img_route'];

                $sql = "UPDATE playlist SET img_route='$img_route' WHERE no='$playlist_no'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_assoc($result);
            }
            $sql = "INSERT INTO playlist_song (playlist_no, song_no) VALUE('$playlist_no', '$song_no')";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);
            
            $result_response = json_encode(["status" => "success", "message" => "", 'response' => 200]);
            
            echo $result_response;
        }
        else if ($type == "list") {
            // title로 song 테이블에서 song.no 가져오기
            if ($email != null) {
                $sql = "SELECT no FROM user WHERE email = '$email'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_assoc($result);
                $user_no = $row['no'];
            } else if ($nickname != null) {
                $sql = "SELECT no FROM user WHERE nickname = '$nickname'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_assoc($result);
                $user_no = $row['no'];
            }
            

            $sql = "SELECT playlist.no,playlist.playlist_name,playlist.img_route,count(playlist_song.playlist_no) tracks 
            FROM playlist 
            LEFT OUTER JOIN playlist_song 
            ON playlist.no=playlist_song.playlist_no 
            WHERE playlist.user_no='$user_no' 
            GROUP BY no";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
            
            if ($row != null) {
                $result_response = json_encode(["status" => "success", "message" => $row, 'response' => 200]);
            }
            else {
                $result_response = json_encode(["status" => "fail", "message" => "", 'response' => 400]);
            }
            echo $result_response;
        }
        else if ($type == "song") {
            $sql = "SELECT DISTINCT
                    playlist_song.no,
                    playlist_song.song_no,
                    song.title,
                    song.genre,
                    song.lyrics,
                    song.mp3_route,
                    artist.artist,
                    album.album,
                    album.reldate,
                    album.img_route,
                    CASE WHEN mlike.mlike = 1 THEN 1 ELSE 0 END AS mlike
                    FROM            
                        playlist_song
                    INNER JOIN song ON playlist_song.song_no = song.no 
                    INNER JOIN artist ON song.artist_no = artist.no
                    INNER JOIN album ON song.album_no = album.no
                    LEFT JOIN mlike ON song.no = mlike.song_no AND mlike.user_no = '$userNo'
                    WHERE
                        playlist_song.playlist_no = '$playlist_no'";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);
            
            if ($row != null) {
                $result_response = json_encode(["status" => "success", "message" => $row, 'response' => 200]);
            }
            else {
                $result_response = json_encode(["status" => "fail", "message" => "", 'response' => 400]);
            }
            echo $result_response;
        }
        else if ($type == "page") {
            $sql = "SELECT playlist.no,user.nickname,playlist.playlist_name,playlist.img_route,count(playlist_song.playlist_no) tracks 
            FROM playlist 
            LEFT OUTER JOIN playlist_song 
            ON playlist.no=playlist_song.playlist_no 
            INNER JOIN user
            ON user.no=playlist.user_no 
            WHERE playlist.no='$playlist_no' 
            GROUP BY no";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_all($result, MYSQLI_ASSOC);

            if ($row != null) {
                $result_response = json_encode(["status" => "success", "message" => $row, 'response' => 200]);
            }
            else {
                $result_response = json_encode(["status" => "fail", "message" => "", 'response' => 400]);
            }
            echo $result_response;
        }
        else if ($type == "song-delete") {
            $sql = "DELETE FROM playlist_song WHERE no='$no'";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);

            $sql = "SELECT * FROM playlist_song WHERE playlist_no='$playlist_no'";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);

            if ($row != null) {
                $row_no = $row['song_no'];
                $sql = "SELECT album.img_route FROM song
                    INNER JOIN album ON song.album_no=album.no
                    WHERE song.no='$row_no'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_array($result);
                $img_route = $row['img_route'];

                $sql = "UPDATE playlist SET img_route='$img_route' WHERE no='$playlist_no'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_assoc($result);
            } else {
                $sql = "UPDATE playlist SET img_route='' WHERE no='$playlist_no'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_assoc($result);
            }
            
            $result_response = json_encode(["status" => "success", "message" => "", 'response' => 200]);
            
            echo $result_response;
        }
        else if ($type == "delete") {
            $sql = "DELETE FROM playlist_song WHERE playlist_no='$playlist_no'";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);
            
            $sql = "DELETE FROM playlist WHERE no='$playlist_no'";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);

            $result_response = json_encode(["status" => "success", "message" => "", 'response' => 200]);
            
            echo $result_response;
        }


        
    }
?>