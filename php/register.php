<?php
session_start();

if (isset($_POST['email'])) {
    if ($_POST['captcha'] != $_SESSION['cap']) {
        $msg = "wrong captcha!";
    } else {
        $data = [
            "name" => $_POST['name'],
            "email" => $_POST['email'],
            "password" => $_POST['password']
        ];

        $ch = curl_init("http://localhost:3000/api/register");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/x-www-form-urlencoded"
        ]);

        $res = curl_exec($ch);

    }
}
?>

<form method="post">
    Name:<input name="name"><br>
    Email:<input name="email"><br>
    Password:<input name="password"><br>

    Captcha: <img src="captcha.php?rand=<?= rand() ?>"><br>

    Enter Captcha: <input name="captcha"><br>
    <button>Register</button>
</form>

<?= $msg ?? "" ?>