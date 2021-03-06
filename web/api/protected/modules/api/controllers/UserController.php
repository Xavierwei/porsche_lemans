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
    $msg = $request->getParam("msg");
    if (!$msg) {
      $this->responseError("params invalid", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS, array("msg" => "required"));
    }
    
    $userAr = new UserAR();
    $ret = $userAr->post_invite_tweet($msg);
    if ($ret === TRUE) {
      $this->responseJSON(array(), "success");
    }
    elseif ($ret === FALSE) {
      $this->responseError("invite friend failed", ErrorAR::ERROR_INVITE);
    }
    else {
      if ($ret == ErrorAR::ERROR_TEAM_MEMBER_FULL) {
        $this->responseError("invite friend faileds - team full", $ret);
      }
      if ($ret == ErrorAR::ERROR_TEAM_MEMBER_LIMITED) {
        $this->responseError("invite friend faileds - team limited", $ret);
      }
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
    // 用户登出
    unset(Yii::app()->session["user"]);
    
    $this->responseJSON(array(), "success");
  }
  
  /**
   * 用户加入一个Team
   */
  public function actionJoinTeam() {
    $request = Yii::app()->getRequest();
    $team_owner_uid = $request->getParam("owner", FALSE);
    $team_id = $request->getParam("team_id", FALSE);
    
    // 2 个参数必须有一个
    if (!$team_owner_uid && !$team_id) {
      $this->responseError("http invlid params", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS);
    }
    
    if ($team_id) {
      $team = TeamAR::model()->findByPk($team_id);
      $team_owner_uid = $team->owner_uid;
    }
    
    $user_ar = UserAR::crtuser();
    if (!$user_ar) {
      $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
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
        // 在这里需要做一个逻辑处理
        // 就是当用户是自动登录并且建立小组的， 我们需要删除之前的小组，
        // 然后才执行加入小组的工作
        if ($user_ar->status == UserAR::STATUS_AUTO_JOIN) {
          $userTeamAr = new UserTeamAR();
          $before_team = $userTeamAr->loadUserTeam($user_ar);
          if ($before_team) {
            // 在这里离开小组
            $user_ar->leaveTeam();
          }
        }

        // 然后再执行其他的流程
        $user_ar->user_join_team($team_owner_uid);
        $user_ar->allowed_invite = 1;
        $user_ar->status = UserAR::STATUS_ENABLED;
        $user_ar->save();
        // 保存用户接受请求的日志
        $code = $invited_data["code"];
        InviteLogAR::logUserAllowInvite($user_ar->uuid, $code);
        
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
          $user_ar->allowed_invite = 0;
          // 在这里还需要判断用户是不是自动注册并且建立小组的
          if ($user_ar->status === UserAR::STATUS_AUTO_JOIN) {
            $user_ar->status = UserAR::STATUS_ENABLED;
          }
          $user_ar->save();
          
          $code = $invited_data["code"];
          InviteLogAR::logUserAllowInvite($user_ar->uuid, $code);
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
    $user = UserAR::crtuser(TRUE);
    if (!$user) {
      $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $request = Yii::app()->getRequest();
    $next_cursor = $request->getParam("next_cursor", 0);
    if (!is_numeric($next_cursor) || $next_cursor == 0) {
      if ($user->from == UserAR::FROM_WEIBO) {
        $next_cursor = 0;
      }
      else {
        $next_cursor = -1;
      }
    }
    
    // array("uuid" => "", "screen_name" => "", "avatar" => "");
    $ret = array();
    if ($user->from == UserAR::FROM_WEIBO) {
      $weibo_api = new SinaWeibo_API(WB_AKEY, WB_SKEY, UserAR::token());
      // 默认返回50个
      $friends = $weibo_api->followers_by_id($user->uuid, $next_cursor);
      
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

      if ($friends["next_cursor"] == 0 && $friends["previous_cursor"] >= 0) {
        // 这个是最后一页
        $next_next_cursor = -1;
      }
      else {
        $next_next_cursor = $friends["next_cursor"];
      }
    }
    else if ($user->from == UserAR::FROM_TWITTER) {
      if ($next_cursor == 0) {
        $next_cursor = -1;
      }
      
      try {
        $friends = Yii::app()->twitter->user_friends($user->uuid, $next_cursor);
      }
      catch (Exception $e) {
        $friends = FALSE;
      }
      
      if (!$friends) {
        $next_next_cursor = 0;
      }
      else {
        foreach ($friends["users"] as $friend) {
          $data = array(
              "uuid" => $friend['id_str'],
              "screen_name" => $friend['screen_name'],
              "avatar_large" => $friend['profile_image_url']
          );
          $ret[] = $data;
        }

        $next_next_cursor = $friends["next_cursor_str"];
        if ($next_next_cursor == 0) {
          $next_next_cursor = -1;
        }
      }
    }
    
    // 去掉已经邀请过的好友
    if ($user->team) {
      $invited_uuids = InviteLogAR::userInvited($user->team->tid, TRUE);
      foreach ($ret as $key => $sns_user) {
        if (in_array($sns_user["uuid"], $invited_uuids)) {
          unset($ret[$key]);
        }
      }
    }
    
    $this->responseJSON($ret, "success", array("next_cursor" => $next_next_cursor));
  }
  
  public function actionIndex() {
    $user = UserAR::crtuser(TRUE);
    if (!$user) {
      $this->responseError("user is not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $data["user"] = $user->attributes;
    
    if ($user->score) {
      $data["user"]["score"] = $user->score->attributes;
    }
    
    if ($user->team) {
      $team_data = array();
      foreach ($user->team as $key => $val) {
        $team_data[$key] = $val;
      }
      //$team_data["users"] = $user->team->users;
      $users = array();
      foreach ($user->team->users as $team_user) {
        $tmp_user = $team_user->attributes;
        if ($team_user->score) {
          $tmp_user["score"] = $team_user->score->attributes;
        }
        $users[] = $tmp_user;
      }
      $team_data["users"] = $users;
      
      // 然后计算 user team 的排名
      $data["team_total"] = $user->team->getTotalTeam();
      $data["team_position"] = $user->team->getTeamPosition();
      $data["team_position"] = $data["team_position"] ? $data["team_position"] : 0;
      
      $data += array (
        "team" => $team_data,
        "last_post" => $user->team->last_post,
      );
      
      if ($user->team && $user->team->score) {
        $data["team"]["score"] = $user->team->score->attributes;
      }
    }
    else {
      $data += array(
          "team" => NULL,
          "last_post" => array()
      );
    }
    
    if ($user->team) {
      $data["team_star"] = $user->team->achivements_total;
    }
    
    // 用户邀请的已经加入的好友
    if ($user->team) {
      $uuids = InviteLogAR::userInvited($user->team->tid, TRUE);
      $rows = InviteLogAR::userInvited($user->team->tid, TRUE, FALSE);
      $thirdpartUsers = UserAR::getUserInfoFromThirdPart($uuids);
      foreach ($thirdpartUsers as &$thirdpartUser) {
        foreach ($rows as $row) {
          if ($thirdpartUser["uuid"] == $row["invited_idstr"]) {
            $thirdpartUser["invitor"] = $row["invitor"];
          }
        }
      }
      $data["inviting"] = $thirdpartUsers;
    }
    else {
      $data["inviting"] = array();
    }
    
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
    $userteamAr = new UserTeamAR();
    $user = UserAR::crtuser();
    $userteam = $userteamAr->loadUserTeam($user);
    if ($userteam) {
      $team = $userteam->team;
      $team->name = $teamName;
      $ret = $team->save();
      if (!$ret) {
        $errors = $userteam->team->getErrors();
      }
    }
    
    return $this->responseJSON(array(), "success");
  }
  
  public function actionLogmail() {
    $request = Yii::app()->getRequest();
    
    if (!$request->isPostRequest) {
      //$this->responseError("http verb error", ErrorAR::ERROR_HTTP_VERB_ERROR);
    }
    $user = UserAR::crtuser();
    if (!$user) {
      $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $mail = $request->getParam("email");
    
    $userMailAr = new UserMailAR();
    $ret = $userMailAr->addNewMail($mail);
    
    if (!$ret) {
      $error = $userMailAr->getErrors();
      $this->responseError($error, ErrorAR::ERROR_MISSED_REQUIRED_PARAMS);
    }
    
    $this->responseJSON(array(), "success");
  }
  
  public function actionLogout() {
    $user = UserAR::crtuser();
    if (!$user) {
      return $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    UserAR::logout();
    
    $this->responseJSON(array(), "success");
  }
  
  public function actionReadtoturial() {
    $user = UserAR::crtuser();
    
    if (!$user) {
      return $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $user->read_tutorial = UserAR::STATUS_HAS_READ_TOTURIAL;
    $user->update();
    
    $this->responseJSON(array(), "success");
  }
  
  /**
   * 取消邀请
   */
  public function actionCancelinvite() {
    $user = UserAR::crtuser(TRUE);
    if (!$user) {
      return $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }
    
    $uid = $user->uid;
    $tid = $user->team->tid;
    
    $request = Yii::app()->getRequest();
    if (!$request->isPostRequest) {
      $this->responseError("http verb error", ErrorAR::ERROR_HTTP_VERB_ERROR);
    }
    
    $uuid = $request->getPost("uuid");
    if (!$uuid) {
        $this->responseError("invalid params", ErrorAR::ERROR_MISSED_REQUIRED_PARAMS);
    }
    InviteLogAR::cancelInvite($uid, $tid, $uuid);
    
    return $this->responseJSON(array(), "success");
  }

  // 搜索好友接口
  public function actionSearchfriends() {
    $user = UserAR::crtuser(TRUE);

    if (!$user) {
      return $this->responseError("user not login", ErrorAR::ERROR_NOT_LOGIN);
    }

    $request = Yii::app()->getRequest();
    $q = $request->getParam("q", "");
    if ($user->from == UserAR::FROM_TWITTER) {
      if (!$q) {
        return $this->responseJSON(array(), "success");
      }

      $ret = array();
      $searched_users = Yii::app()->twitter->search_user($q);
      foreach ($searched_users as $friend) {
        $data = array(
            "uuid" => $friend['id_str'],
            "screen_name" => $friend['screen_name'],
            "avatar_large" => $friend['profile_image_url']
        );
        $ret[] = $data;
      }
    }
    else {
      $weibo_api = new SinaWeibo_API(WB_AKEY, WB_SKEY, UserAR::token());
      $searched_users = $weibo_api->search_at_users($q);
      $weibo_uids = array();
      foreach ($searched_users as $searched_user) {
        $weibo_uids[] = $searched_user["uid"];
      }

      $weibo_users = array();
      foreach ($weibo_uids as $weibo_uid) {
        $weibo_users[] = $weibo_api->show_user_by_id($weibo_uid);
      }

      $ret = array();
      foreach ($weibo_users as $friend) {
        $data = array(
            "uuid" => $friend['idstr'],
            "screen_name" => $friend['screen_name'],
            "avatar_large" => $friend['avatar_large']
        );
        $ret[] = $data;
      }
      //TODO:: 高级接口有了后 直接可以用了
      //$searched_users = $weibo_api->users_show_batch_by_id($weibo_uids);
    }

    // 去掉已经邀请过的好友
    if ($user->team) {
      $invited_uuids = InviteLogAR::userInvited($user->team->tid);
      foreach ($ret as $key => $sns_user) {
        if (in_array($sns_user["uuid"], $invited_uuids)) {
          unset($ret[$key]);
        }
      } 
    }

    $this->responseJSON($ret, "success");
  }
}
