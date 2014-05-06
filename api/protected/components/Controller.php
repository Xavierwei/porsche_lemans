<?php

/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController {

  public function beforeAction($action) {
    // Custom logic
    return parent::beforeAction($action);
  }

  public function responseError($message) {
    $this->_renderjson($this->wrapperDataInRest(NULL, $message, TRUE));
  }

  public function randomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
  }

  // 在这里加缓存功能
  public function responseJSON($data, $message, $ext = array()) {
    $request = Yii::app()->getRequest();
    $controllerName = Yii::app()->controller->id;
    $actioName = Yii::app()->controller->action->id;

    $this->_renderjson($this->wrapperDataInRest($data, $message, FALSE, $ext));
  }

  public function wrapperDataInRest($data, $message = '', $error = FALSE, $ext = array()) {
    $json = array(
        "status" => !$error,
        "message" => $message,
        "data" => $data
    );

    if (!empty($ext)) {
      $json += $ext;
    }

    return $json;
  }

  private function _renderjson($data) {
    header("Content-Type: application/json; charset=UTF-8");
    print CJavaScript::jsonEncode($data);
    die();
  }

  // 辅助方法
  public function isPost() {
    return Yii::app()->getRequest()->isPostRequest;
  }

  public function isPut() {
    return Yii::app()->getRequest()->isPutRequest;
  }

  public function __construct($id, $module = null) {
    parent::__construct($id, $module);

    $id = Yii::app()->user->getId();
    // 未登陆情况下 设置一个默认的 useridentity
    if (!$id) {
      $userIdentity = new UserIdentity("", "");
      Yii::app()->user->login($userIdentity);
    }
  }

  public function init() {
    parent::init();

    Yii::app()->attachEventHandler("onError", array($this, "actionError"));
    Yii::app()->attachEventHandler("onException", array($this, "actionError"));
  }

  public function actionError() {
    $error = Yii::app()->errorHandler->error;
    if (!$error) {
      $event = func_get_arg(0);
      if ($event instanceof CExceptionEvent) {
        return $this->responseError($event);
      }
      else if ($event instanceof CErrorEvent) {
        return $this->responseError($event);
      }
    }
    $this->responseError($error);
  }

}
