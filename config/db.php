<?php
    class Database {
        private $host = "localhost";
        private $username = "root";
        private $password = "";
        private $database = "ha_cozy_pad_db";
        private $port = 3307;
        protected $conn;

        public function __construct() {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->database, $this->port);
            if($this->conn->connect_error) {
                die("Database connection Failed!");
            }
        }

        public function getConnection() {
            return $this->conn;
        }
    }
?>