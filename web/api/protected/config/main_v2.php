<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');
// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'lemans',
    'language'=>'en_us',
    'sourceLanguage'=>'en_us',
    "defaultController" => "index",
    // preloading 'log' component
    'preload' => array('log'),
    // autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
    ),
    'modules' => array(
        'api',
        "admin",
    // uncomment the following to enable the Gii tool
    /*
      'gii'=>array(
      'class'=>'system.gii.GiiModule',
      'password'=>'Enter Your Password Here',
      // If removed, Gii defaults to localhost only. Edit carefully to taste.
      'ipFilters'=>array('127.0.0.1','::1'),
      ),
     */
    ),
    // application components
    'components' => array(
        "shorturl" => array(
            "class" => "ext.shorturl.GoogleShortUrl",
        ),
        "twitter" => array(
            "class" => "ext.yii-twitter-OAuth.STwitter",
            "consumer_key" => "UOPfUKiyPwdRX3CBP3fWK61XE",
            "consumer_secret" => "wTu5hYsRkVnWwLnBDjTdLHI5xlmMbQW77NccxvwtIKEQuubSSw",
            "callback" => "http://lemans.local/api/sns/twittercallback",
            "signinParams" => array("force_write"),
        ),
        'user' => array(
            // enable cookie-based authentication
            'allowAutoLogin' => true,
        ),
        // uncomment the following to enable URLs in path-format	
        'urlManager' => array(
            'urlFormat' => 'path',
              'urlSuffix'=>'.html',
            'rules' => array(  
                '<action:\w+>' => 'index/<action>',
                '<controller:\w+>/<id:\d+>' => '<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
                '<module:\w+>/<controller:\w+>/<action:\w+>'=>'<module>/<controller>/<action>', 
            ),
        ),
        // uncomment the following to use a MySQL database
        'db' => array(
            'connectionString' => 'mysql:host=localhost;dbname=lemans',
            'emulatePrepare' => true,
            'username' => 'root',
            'password' => 'admin',
            'charset' => 'utf8',
        ),
        'errorHandler' => array(
            // use 'site/error' action to display errors
            'errorAction' => 'api/web/error',
        ),
        "session" => array(
            'class' => 'system.web.CDbHttpSession',
            'connectionID' => 'db',
            'sessionName' => 'LUCSID',
            'sessionTableName' => 'session',
            'timeout' => 3600 * 24,
            'cookieMode' => 'allow',
            'cookieParams' => array(
                'lifetime' => 3600 * 24,
                'path' => '/',
                'httpOnly' => true),
        ),
        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning, trace',
                ),
            // uncomment the following to show log messages on web pages
            /*
              array(
              'class'=>'CWebLogRoute',
              ),
             */
            ),
        ),
    ),
    // application-level parameters that can be accessed
    // using Yii::app()->params['paramName']
    'params' => array(
        // this is used in contact page
        'adminEmail' => 'jziwenchen@gmail.com', 
        "weibo_uid" => "5072167230",
        "twitter_uid" => "568873580",
        "uploadedPath" => realpath((dirname(__FILE__).'/../../upload')),
        'startTime'=>'2014-06-1 02:43:07',
    ),
);
