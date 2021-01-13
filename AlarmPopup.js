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

class AlarmPopup {

  /********************************************************************
   * If window.top.AlarmPopup is undefined then creates a new instance
   * of AlarmPopup at this location and, in either case, returns a
   * reference to window.top.AlarmPopup or null is some error occurred.
   *
   * This method should be the **only** way a client application
   * acquires AlarmPopup service. 
   */
   
  static install(signalkClient) {
    if (window.top.AlarmPopup) {
      return(window.top.AlarmPopup);
    } else {
      try {
        window.top.AlarmPopup = new AlarmPopup(signalkClient);
        return(window.top.AlarmPopup);
      } catch(e) {
        console.log("AlarmPopup: install error (%s)", e);
      }
    }
    return(null)
  }

  constructor(signalkClient) {
    if (!signalkClient) throw "invalid Signal K client";

    this.signalkClient = signalkClient;

    this.popup = PageUtils.createElement('div', 'alarmpopup', null, null, window.top.document.body);
    this.popupContainer = PageUtils.createElement('div', 'alarmpopup-container', null, null, this.popup);
    this.popupNotificationPanel = PageUtils.createElement('div', 'alarmpopup-notification-panel', null, null, this.popupContainer);
    this.popupAcknowledgeButton = PageUtils.createElement('div', 'alarmpopup-acknowledge-button', null, "ACKNOWLEDGE", this.popupContainer);
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
    this.popup.style.visibility = "hidden";
    this.signalkClient.onValue("notifications.plugins.pdjr-skplugin-alarm-manager.digest", (notifications) => {
      this.popupNotificationPanel.innerHTML = "";
      notifications.filter(notification => ((notification.method == []) || (notification.method.includes("visual")))).forEach(notification => {
        var elem = PageUtils.createElement('div', null, 'new alarmpopup-notification ' + notification.state, notification.message, this.popupNotificationPanel);
      });
      if (notifications.filter(notification => (notification.method.includes("sound"))).length) this.beep();
      this.popup.style.visibility = (notifications.length)?"visible":"hidden";
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
