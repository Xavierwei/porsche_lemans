<?php
Yii::import('ext.sinaWeibo.SinaWeibo_API',true);
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UserController
 *
 * @author jackeychen
 */
class UserController extends Controller{
  public function init() {
    parent::init();
  }
  
  /**
   * 邀请好友接口.
   * 接受 POST 方法
   */
  public function actionInvite() {
    $request = Yii::app()->getRequest();
    
    // 参数检查
    $msg = $request->getPost("msg");
    if (!$msg) {
      $this->responseError("params invalid", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS, array("msg" => "required"));
    }
    
    $userAr = new UserAR();
    $ret = $userAr->post_invite_tweet($msg);
    if ($ret) {
      $this->responseJSON(array(), "success");
    }
    else {
      $this->responseError("invite friend failed", ErrorAR::ERROR_INVITE);
    }
  }
  
  /**
   * 队员离开团队
   */
  public function actionLeaveteam() {
    $request = Yii::app()->getRequest();
    
    $user = UserAR::crtuser();
    if (!$user) {
      return $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $ret = $user->leaveTeam();
    $this->responseJSON(array(), "success");
  }
  
  /**
   * 用户加入一个Team
   * 注意参数不是一个 team id 而是队长的uid 后台可以根据队长uid 来获取Team id
   */
  public function actionJoinTeam() {
    $request = Yii::app()->getRequest();
    $team_owner_uid = $request->getParam("owner", FALSE);
    
    $invited_data = Yii::app()->session["invited_data"];
    if ($invited_data) {
      $inviter = $invited_data["uid"];
    }
    else {
      $inviter = 0;
    }
    
    if ($team_owner_uid > 0) {
      $user_ar = UserAR::crtuser();
      if ($user_ar) {
        $user_ar->user_join_team($team_owner_uid);
        if ($team_owner_uid == $inviter) {
          unset(Yii::app()->session["invited_data"]);
        }
      }
    }
    else {
      // 如果什么也没有传，则认为参数错误
      if ($team_owner_uid === FALSE) {
        $this->responseError("invalid params", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS);
      }
      // 如果传了 但是又是 < 0 的值 则认为是不接受邀请
      else {
        if ($inviter) {
          $user_ar->update(array("allowed_invite" => 0));
        }
      }
    }
    
    $this->responseJSON(array(), "success");
  }
  
  public function actionBuildTeam() {
    $request = Yii::app()->getRequest();
    $name = $request->getParam("name");
    if ($name) {
      $team_ar = TeamAR::newteam($name);
      if ($team_ar instanceof TeamAR) {
        $this->responseJSON($team_ar->attributes, "build team success");
      }
      else {
        $this->responseError("validate failed", ErrorAR::ERROR_VALIDATE_FAILED, $team_ar);
      }
    }
    else {
      $this->responseError("team name is required", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS, array("name" => "required"));
    }
  }
  
  public function actionFriendssuggestion() {
    $request = Yii::app()->getRequest();
    $q = $request->getParam("q");
    $token = UserAR::token();
    if ($token) {
      $weibo_api = new SinaWeibo_API(WB_AKEY, WB_SKEY, UserAR::token());
      $users = $weibo_api->search_at_users($q);
      $this->responseJSON($users, "success");
    }
    else {
      $this->responseError("user is not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    $this->responseJSON(array(), "HELLO");
  }
  
  public function actionFriends() {
    $user = UserAR::crtuser();
    if (!$user) {
      $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    // array("uuid" => "", "screen_name" => "", "avatar" => "");
    $ret = array();
    if ($user->from == UserAR::FROM_WEIBO) {
      $weibo_api = new SinaWeibo_API(WB_AKEY, WB_SKEY, UserAR::token());
      // 默认返回5000个
      $friends = $weibo_api->friends_by_id($user->uuid);
      if (!isset($friends["users"])) {
        return  $this->responseError("error", ErrorAr::ERROR_UNKNOWN);
      }
      
      foreach ($friends["users"] as $friend) {
        $data = array(
            "uuid" => $friend['idstr'],
            "screen_name" => $friend['screen_name'],
            "avatar_large" => $friend['avatar_large']
        );
        $ret[] = $data;
      }
    }
    else if ($user->from == UserAR::FROM_TWITTER) {
      $friends = Yii::app()->twitter->user_friends($user->uuid);
      foreach ($friends["users"] as $friend) {
        $data = array(
            "uuid" => $friend['id_str'],
            "screen_name" => $friend['screen_name'],
            "avatar_large" => $friend['profile_image_url']
        );
        $ret[] = $data;
      }
    }
    $this->responseJSON($ret, "success");
  }
  
  public function actionIndex() {
    $user = UserAR::crtuser(TRUE);
    if (!$user) {
      $this->responseError("user is not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $data = array(
        "user" => $user,
    );
    
    if ($user->team) {
      $team_data = array();
      foreach ($user->team as $key => $val) {
        $team_data[$key] = $val;
      }
      $team_data["users"] = $user->team->users;
      $data += array(
        "team" => $team_data,
        "last_post" => $user->team->last_post,
      );
    }
    else {
      $data += array(
          "team" => NULL,
          "last_post" => array()
      );
    }
    
    
    $data["team_total"] = 1000;
    $data["team_position"] = 10;
    $data["team_star"] = 2;
    
    $this->responseJSON($data, "success");
  }
  
  public function actionUpdateteam() {
    $request = Yii::app()->getRequest();
    
    if (!$request->isPostRequest) {
      $this->responseError("http verb error", ErrorAR::ERROR_HTTP_VERB_ERROR);
    }
    
    $teamName = $request->getPost("name");
    if (!$teamName) {
      $this->responseError("invlid error", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS);
    }
    return $this->responseJSON(array(), "success");
  }
}
