# signalk-alarm-widget

__signalk-alarm-widget__ implements __AlarmWidget.js__, a web component
for use in Signal K webapps.

__AlarmWidget.js__ is designed to be embedded in a host web page where it
will monitor alarm notifications raised by
[__signalk-alarm__](https://github.com/preeve9534/signalk-alarm#readme),
displaying a visible and audible announcement of active alarm notifications.

## Use

Download the following libraries to a location accessible from your webapp
your webapp and include the JavaScript and CSS components by adding
something like this at the top of your main webapp file (usually
'index.html' or 'index.js').
```
<script type="text/javascript" src="lib/signalk-alarm-widget/AlarmWidget.js"></script>

<link rel="stylesheet" type="text/css" href="lib/signalk-alarm-widget/AlarmWidget.css">
```
