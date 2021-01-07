# AlarmPopup

__AlarmPopup__ is a JavaScript class implementing a widget that
provides a popup announcement of alarm notifications on a connected
Signal K server.

It is assumed that the widget will be used within a Signal K webapp,
but it could be used outside of the Signal K context dependent upon the
constraints imposed by the host browser's cross-domain security policy.

The appearance and some aspects of widget behaviour can be styled using
CSS.

# Requirements

The remote Signal K server must be running
[__pdjr-skplugin-alarm__](https://github.com/preeve9534/pdjr-skplugin-alarm#readme)
or another application that provides a digest of alarm notifications
that can be monitored by the widget.

## Use

The following discussion assumes that the terminal's current working
directory is the root of the host web application.

Begin by downloading the required JS libraries.
```
$> npm install pdjr-lib-page-utils 
$> npm install pdjr-sklib-signalk-client
$> npm install pdjr-skwidget-alarm-client
```
Add the following initialisation function to your webapp.
```
function initAlarmPopup() {
      var signalkClient = SignalkClient.connect();
      signalkClient.waitForConnection().then(
        () => {
          AlarmPopup.install(signalkClient);
          SwitchMonitorWidget.install(signalkClient);
        },
        () => {
          console.log("error initialising Signal K client library");
        }
      );
    }

}


[__pdjr-page-utils__](https://github.com/preeve9534/pdjr-lib-page-utils#readme)



Download the following libraries to a location accessible from your webapp
your webapp and include the JavaScript and CSS components by adding
something like this at the top of your main webapp file (usually
'index.html' or 'index.js').
```
<script type="text/javascript" src="lib/signalk-alarm-widget/AlarmPopup.js"></script>

<link rel="stylesheet" type="text/css" href="lib/signalk-alarm-widget/AlarmPopup.css">
```
