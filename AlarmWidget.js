/**
 * Copyright 2020 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class AlarmWidget {

  /********************************************************************
   * This static method returns a handle to the AlarmClient instance
   * installed at window.top.AlarmClient. If there is no AlarmClient at
   * this location, then a new AlarmClient instance is installed.
   *
   * This method should be the **only** way a client application
   * acquires AlarmClient service. 
   */
   
  static install(signalkClient) {
    if (window.top.AlarmWidget) {
      return(window.top.AlarmWidget);
    } else {
      try {
        window.top.AlarmWidget = new AlarmWidget(signalkClient);
        return(window.top.AlarmWidget);
      } catch(e) {
        console.log("AlarmWidget: install error (%s)", e);
      }
    }
    return(null)
  }

  constructor(signalkClient) {
    if (!signalkClient) throw "invalid Signal K client";

    this.signalkClient = signalkClient;

    this.popup = PageUtils.createElement('div', 'alarmwidget', null, null, window.top.document.body);
    this.popupContainer = PageUtils.createElement('div', 'alarmwidget-container', null, null, this.popup);
    this.popupNotificationPanel = PageUtils.createElement('div', 'alarmwidget-notification-panel', null, null, this.popupContainer);
    this.popupAcknowledgeButton = PageUtils.createElement('div', 'alarmwidget-acknowledge-button', null, "ACKNOWLEDGE", this.popupContainer);
    this.popupAcknowledgeButton.addEventListener('click', function (e) { this.handleAcknowledge(e); }.bind(this));
    this.connect();
  }

  /********************************************************************
   * Use Signal K client to register a callback against changes on the
   * alarm notification digest at "notifications.plugins.alarm.digest".
   *
   * The callback handler updates popup content from the notification
   * digest and displays the popup. If any of the new notifications
   * advises the "sound" method, the display is accompanied by a beep.
   */
  
  connect() {
    this.popup.style.visible = "none";
    this.signalkClient.registerCallback("notifications.plugins.alarm.digest", (notifications) => {
      this.popupNotificationPanel.innerHTML = "";
      notifications.filter(notification => ((notification.method == []) || (notification.method.includes("visual")))).forEach(notification => {
        var elem = PageUtils.createElement('div', null, 'new alarmwidget-notification ' + notification.state, notification.message, this.popupNotificationPanel);
      });
      if (notifications.filter(notification => (notification.method.includes("sound"))).length) this.beep();
      this.popup.style.visible = (notifications.length)?"normal":"none";
    });
  }

  /********************************************************************
   * Click handler for the acknowledge button.
   */

  handleAcknowledge(e) {
    if (this.popup.classList.contains("zoom")) {
      this.popup.classList.remove("zoom");
    } else {
      this.popup.classList.add("zoom");
    }
  }

  beep() {
    var audio = new Audio('chime.wav'); 
    audio.currentTime = 0
    audio.play(); 
  } 

}
