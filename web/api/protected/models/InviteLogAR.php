<?php

/**
 * 邀请码记录表
 */
class InviteLogAR extends CActiveRecord {
  const STATUS_ALLOW_INVITE = 1;
  const STATUS_DISALLOW_INVITE = 2;
  const STATUS_DEFAULT = 0;
  
  public function tableName() {
    return "invite_log";
  }
  
  public function primaryKey() {
    return "ilid";
  }
  
  public static function model($classname = __CLASS__) {
    return parent::model($classname);
  }
  
  public function beforeSave() {
    if ($this->isNewRecord) {
      $this->cdate = date("Y-m-d H:i:s");
    }
    return parent::beforeSave();
  }
  
  /**
   * 记录被邀请 数据
   * @param type $invitor
   * @param type $invitees 一组 idstrs
   * @param type $team_id
   */
  public static function logInvite($invitor, $invitees, $team_id, $code) {
    
    foreach ($invitees as $invitee) {
      $inviteLogAr = new InviteLogAR();
      $inviteLogAr->invite_code = $code;
      $inviteLogAr->invited_idstr = $invitee;
      $inviteLogAr->invitor = $invitor;
      $inviteLogAr->status = self::STATUS_DEFAULT;
      $inviteLogAr->tid = $team_id;
      
      if ($inviteLogAr->save()) {
        //TODO:: 保存成功后 有什么逻辑要处理?
      }
    }
  }
  
  /**
   * 记录用户接受邀请数据
   * @param type $idStr 第三方用户ID 
   * @param type $code 邀请码
   */
  public static function logUserAllowInvite($idstr, $code) {
    $query = new CDbCriteria();
    $query->addCondition("invited_idstr=:idstr")
            ->addCondition("invite_code=:code");
    $query->params = array(":idstr" => $idstr, ":code" => $code);
    
    $row = self::model()->find($query);
    if ($row) {
      $row->status = self::STATUS_ALLOW_INVITE;
      $row->save();
    }
    
    return TRUE;
            
  }
  
  /**
   * 记录用户拒绝邀请数据
   * @param type $idStr 第三方用户ID 
   * @param type $code 邀请码
   */
  public static function logUserDisallowInvite($idstr, $code) {
    $query = new CDbCriteria();
    $query->addCondition("invited_idstr=:idstr")
            ->addCondition("invite_code=:code");
    $query->params = array(":idstr" => $idstr, ":code" => $code);
    
    $row = self::model()->find($query);
    if ($row) {
      $row->status = self::STATUS_DISALLOW_INVITE;
      $row->save();
    }
    
    return TRUE;
  }
  
  /**
   * 查询用户是否接受了 invitor 的 team 邀请
   * @param type $idstr
   * @param type $code
   */
  public static function useWasAllowedInvite($idstr, $code) {
      $query = new CDbCriteria();
      $query->addCondition("invited_idstr=:invited_idstr")
              ->addCondition("invite_code=:code")
              ->addCondition("status <> :status");
      $query->params = array(
          ":invited_idstr" => $idstr,
          ":code" => $code,
          ":status" => self::STATUS_DEFAULT
      );
      $row = self::model()->find($query);
      if ($row) {
        return TRUE;
      }
      return FALSE;
  }
  
  public static function newInviteCode() {
    return uniqid("invite_");
  }
}
