<?php
    class DB{
        private static $instance;
        private $dbConn;

        private function __construct() {}

        private static function getInstance(){
            if(self::$instance == null){
                $className = __CLASS__;
                self::$instance = new $className;
            }

            return self::$instance;
        }

        private static function initConnection(){
            $db = self::getInstance();
            // $connConf = getConfigData();
            $host = "localhost";
            $username = "root";
            $password = "silver-100";
            $database = "u17209600";
            $db->conn = new mysqli($host, $username, $password, $database);
            
            return $db;

        }

        public static function getDbConn(){
            try {
                $db = self::initConnection();
                return $db->conn;
            } catch(Exception $ex) {
                echo "Connection to database failed" . $ex->getMessage();
                return null;
            }
        }



    }
?>