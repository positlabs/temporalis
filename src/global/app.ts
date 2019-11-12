import 'webrtc-adapter'

var _gaq = _gaq || []
_gaq.push(['_setAccount', 'UA-24253469-1'])
_gaq.push(['_trackPageview'])
;(function() {
  var ga = document.createElement('script')
  ga.type = 'text/javascript'
  ga.async = true
  ga.src =
    ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') +
    '.google-analytics.com/ga.js'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(ga, s)
})()

// https://developers.google.com/web/fundamentals/app-install-banners/
// prompt user to install webapp
if (localStorage.getItem('returningUser')) {
  window.addEventListener('beforeinstallprompt', e => {
    const event = e as any
    event.prompt()
  })
} else {
  localStorage.setItem('returningUser', 'true')
}
