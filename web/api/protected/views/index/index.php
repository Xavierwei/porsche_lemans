  <!--  -->
  <div class="page pagebg8">
        <!--  -->
        <div class="header">
            <div class="logo">PORSCHE</div>
            <div class="hd_info"></div>
        </div>

    <div class="count">
      <div class="conut_tit" data-fadein><p>Le Mans</p>#24SocialRace</div>
      
      <!-- <div class="conut_watch" data-fadein>watch the trailer</div> -->
      <div class="conut_tips" ><?=Yii::t('lemans','Join the race and create your team now')?></div>
      <div class="home_v"></div>
      <div class="home_share">
        <!--   -->
      <a href="<?php echo UserAR::weibo_login_url() ?>" class="home_weibo"></a>
      <a href="<?php echo UserAR::twitter_login_url()  ?>" class="home_twitter"></a>
      </div>
      <div class="btn home_winners" data-a="winners-prizes"><?=Yii::t('lemans','Winners’ Prizes')?></div>
    </div>
        <div id="home_video">
            <a class="skipintro" href="#" data-a="skip-intro"><?=Yii::t('lemans','Skip intro')?></a>
        </div>
    <div id="winners-prizes">
      <div class="popup_close"></div>
      <h2>Winners’ Prizes</h2>
            <img class="winners-icon" src="/images/winner_prizes.png">
      <div class="winners-prizes-con clearfix">
        At the end of the 24h social race, the first team will win a very exclusive global trip to attend every motorsports events in the world, from the classic 24h of Daytona, the famous 12h of Sebring or the next edition of Le Mans, all with VIP access.
      </div>
    </div>

  </div>
  <!--  -->