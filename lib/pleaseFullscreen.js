window.PleaseFullscreen = () => {

	const styleEl = document.createElement('style')
	document.head.appendChild(styleEl)
	const styleSheet = styleEl.sheet
	function addCssRule(str) {
		styleSheet.insertRule(str, styleSheet.cssRules.length)
	}

	function htmlToFrag(html) {
		return document.createRange().createContextualFragment(html.trim())
	}

	function addFragToBodyAndReturnNode(frag) {
		document.body.appendChild(frag)
		return document.body.lastChild
	}

	//addCssRule(`
	//	#pleaseFullscreenDebug {
	//		position: absolute;
	//		top: 0;
	//		left: 0;
	//		z-index: 1;
	//		color: pink;
	//	}
	//`)
	//const pleaseFullscreenDebug = addFragToBodyAndReturnNode(htmlToFrag(`<div id="pleaseFullscreenDebug"></div>`))
	//setInterval(() => {
	//	const deviceHeight = Math.min(window.screen.height, window.screen.width)
	//	const heightTakenRatio = deviceHeight ? window.innerHeight / deviceHeight : 1 // 0..1
	//	const isBigEnough = heightTakenRatio >= 0.9
	//	pleaseFullscreenDebug.innerText = `
	//		window.screen.height = ${window.screen.height}
	//		window.screen.width = ${window.screen.width}
	//		window.outerHeight = ${window.outerHeight}
	//		window.outerWidth = ${window.outerWidth}
	//		window.innerHeight = ${window.innerHeight}
	//		window.innerWidth = ${window.innerWidth}
	//		window.devicePixelRatio = ${window.devicePixelRatio}
	//		window.screenTop = ${window.screenTop}
	//		heightTakenRatio: ${Math.round(heightTakenRatio * 100) / 100}
	//	`
	//}, 100)


	// common CSS

	addCssRule(`
		.landscapeFullscreenOverlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.8);
			align-items: center;
			justify-content: center;
			color: white;
			font-size: 32px;
		}
	`)

	addCssRule(`
		.landscapeFullscreenOverlay > .closeButton {
			position: absolute;
			top: 20px;
			left: 20px;
			width: 30px;
			height: 30px;
			padding: 5px;
			border-radius: 10px;
			color: black;
			background-color: cyan;
			font-size: 32px;
			font-weight: bold;
			text-align: center;
			border: 3px solid cyan;
		}
	`)

	addCssRule(`
		.landscapeFullscreenOverlay > .closeButton:hover {
			background-color: black;
			color: white;
		}
	`)

	addCssRule(`
		.landscapeFullscreenOverlay > .closeButtonTip {
			position: absolute;
			top: 32px;
			left: 77px;
			color: cyan;
			font-size: 22px;
		}
	`)


	// rotation

	addCssRule(`
		#pleaseRotate {
			display: none;
		}
	`)

	addCssRule(`
		@media only screen and (max-width: 640px) {
			#pleaseRotate {
				display: flex;
			}
		}
	`)

	const pleaseRotateDiv = addFragToBodyAndReturnNode(htmlToFrag(`
		<div id="pleaseRotate" class="landscapeFullscreenOverlay">
			<div class="closeButton">&times;</div>
			<div class="closeButtonTip">Hide this panel</div>
			<div style="text-align: center;">
				<img src="lib/pleaseRotate.png">
				<br>
				<br>
				<p>Please rotate your device</p>
			</div>
		</div>
	`))

	pleaseRotateDiv.getElementsByClassName('closeButton')[0].addEventListener('click', () => {
		pleaseRotateDiv.parentElement.removeChild(pleaseRotateDiv)
	})


	// fullscreen

	const isIOS = /iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent)
	if (!isIOS) {

		addCssRule(`
			#pleaseFullscreen {
				display: none;
			}
		`)

		addCssRule(`
			@media only screen and (max-height: 480px) and (display-mode: browser) {
				#pleaseFullscreen {
					display: flex;
				}
			}
		`)

		const pleaseFullscreen = addFragToBodyAndReturnNode(htmlToFrag(`
			<div id="pleaseFullscreen" class="landscapeFullscreenOverlay">
				<div class="closeButton">&times;</div>
				<div class="closeButtonTip">Hide this panel</div>
				<div style="text-align: center;">
					<img src="lib/pleaseFullscreen.png">
					<br>
					<br>
					<p>Please tap for fullscreen</p>
				</div>
			</div>
		`))

		pleaseFullscreen.getElementsByClassName('closeButton')[0].addEventListener('click', (e) => {
			pleaseFullscreen.parentElement.removeChild(pleaseFullscreen)
			e.stopPropagation()
		})

		pleaseFullscreen.addEventListener('click', (e) => {
			const el = document.documentElement
			if (el.requestFullscreen) {
				el.requestFullscreen()
			}
			else if (el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen()
			}
			else if (el.mozRequestFullScreen) {
				el.mozRequestFullScreen()
			}
		})

		document.addEventListener('fullscreenchange', onFullscreenChange)
		document.addEventListener('webkitfullscreenchange', onFullscreenChange)
		document.addEventListener('mozfullscreenchange', onFullscreenChange)
		function onFullscreenChange() {
			const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)
			if (isFullscreen) {
				document.body.removeChild(pleaseFullscreen)
			}
			else {
				document.body.appendChild(pleaseFullscreen)
			}
		}

	}
	// IOS
	else {

		addCssRule(`
			#pleaseScroll > .closeButton {
				top: 10px;
				left: 10px;
			}
		`)
		addCssRule(`
			#pleaseScroll > .closeButtonTip {
				top: 22px;
				left: 66px;
			}
		`)

		const pleaseScrollDiv = addFragToBodyAndReturnNode(htmlToFrag(`
			<div id="pleaseScroll" class="landscapeFullscreenOverlay" style="display: flex; align-items: start;">
				<div class="closeButton">&times;</div>
				<div class="closeButtonTip">Hide this panel</div>
				<div style="text-align: center;">
					<p style="margin-top: 64px; margin-bottom: 20px;">Please scroll down for fullscreen, or</p>
					<img src="lib/pleaseAddIOS.png">
				</div>
			</div>
		`))
		document.body.removeChild(pleaseScrollDiv)

		pleaseScrollDiv.getElementsByClassName('closeButton')[0].addEventListener('click', (e) => {
			if (isPleaseScrollDisplayed) {
				pleaseScrollDiv.parentElement.removeChild(pleaseScrollDiv)
			}
			clearInterval(scrollIntervalHandle)
		})

		let isPleaseScrollDisplayed = false
		const scrollIntervalHandle = setInterval(() => {
			const deviceHeight = Math.min(window.screen.height, window.screen.width)
			const heightTakenRatio = deviceHeight ? window.innerHeight / deviceHeight : 1 // 0..1
			//pleaseFullscreenDebug.innerText = `
			//	heightTakenRatio = ${heightTakenRatio}
			//`
			if (heightTakenRatio < 0.9 && !isPleaseScrollDisplayed) {
				document.body.appendChild(pleaseScrollDiv)
				window.scroll(0, 0)
				isPleaseScrollDisplayed = true
			}
			else if (isPleaseScrollDisplayed && heightTakenRatio >= 1.0) {
				document.body.removeChild(pleaseScrollDiv)
				isPleaseScrollDisplayed = false
			}
		}, 100)

		window.addEventListener('scroll', (e) => {
			if (isPleaseScrollDisplayed && window.scrollY > 0) {
				window.scroll(0, 0)
			}
		})


	}

}
