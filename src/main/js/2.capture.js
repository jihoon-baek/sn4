import state from './state'
import step3 from './3.selectPhoto';
import { getImgSize } from './utils';

export default () => {
    step2();
}

const camInfo = {
    camW: 640,
    camH: 380,
    paddingW: 0,
    paddingH: 0,
}

const step2 = () => {
    const msg = document.createElement('div');
    msg.id = 'stageMsg';
    msg.style.position = 'absolute';
    msg.style.top = '30px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.display = 'flex';
    msg.style.alignItems = 'center';
    msg.style.justifyContent = 'center';
    msg.style.gap = '20px';
    msg.style.fontFamily = "'NEXON Lv1 Gothic OTF', sans-serif";
    msg.style.fontSize = '32px';
    msg.style.fontWeight = '700';
    msg.style.color = '#333';
    msg.style.zIndex = '10';
    msg.style.width = 'auto';
    msg.style.height = 'auto';
    msg.style.marginLeft = '0';
    msg.innerHTML = `<span>촬영을 시작합니다</span><span id="timerText" style="font-size: 60px; color: #e74c3c; font-family: 'LOTTERIACHAB', sans-serif; min-width: 60px; text-shadow: 0 0 5px rgba(255,255,255,0.8);"></span>`;
    document.body.appendChild(msg);

    const videoContainer = document.createElement('div');
    const { width, height } = getImgSize(state.frameNum);
    videoContainer.id = 'videoContainer';
    videoContainer.style.width = `${width}px`;
    videoContainer.style.height = `${height}px`;
    videoContainer.style.bottom = '20px';
    videoContainer.style.left = '50%';
    videoContainer.style.position = 'absolute';
    videoContainer.style.overflow = 'hidden';
    videoContainer.style.transform = 'translateX(-50%) scale(1)';
    videoContainer.style.transformOrigin = 'bottom center';
    videoContainer.style.marginLeft = '0';

    const videoElem = document.createElement('video');
    videoElem.autoplay = 'true';
    videoElem.width = width;
    videoElem.height = height;
    videoElem.style.position = 'absolute';
    videoElem.id = 'videoElement';
    videoElem.style.top = '0px';
    videoElem.style.objectFit = 'cover';
    videoElem.style.overflow = 'hidden';
    videoContainer.appendChild(videoElem);
    document.body.appendChild(videoContainer);

    // Responsive scaling script (ensures everything fits inside viewport without scrollbars)
    const fitLayout = () => {
        const container = document.getElementById('videoContainer');
        if (!container) {
            window.removeEventListener('resize', fitLayout);
            return;
        }
        const baseW = width;
        const baseH = height;
        const winW = window.innerWidth - 40;
        const winH = window.innerHeight - 120; // 100px for title/top area + 20px bottom margin

        const scale = Math.min(winW / baseW, winH / baseH, 1);
        container.style.transform = `translateX(-50%) scale(${scale})`;
    };

    window.addEventListener('resize', fitLayout);
    fitLayout(); // Trigger initial sizing

    const timerText = document.getElementById('timerText');

    const audio = new Audio('assets/snap.mp3');
    audio.id = 'audio';
    document.body.appendChild(audio);

    videoElem.addEventListener("loadedmetadata", () => {
        const camRatio = videoElem.videoWidth / videoElem.videoHeight;
        const imgRatio = width / height;
        if (imgRatio > camRatio) {
            camInfo.camW = videoElem.videoWidth;
            camInfo.camH = camInfo.camW * (height / width);
            camInfo.paddingH = (videoElem.videoHeight - camInfo.camH) / 2;
        } else {
            camInfo.camH = videoElem.videoHeight;
            camInfo.camW = camInfo.camH * (width / height);
            camInfo.paddingW = (videoElem.videoWidth - camInfo.camW) / 2;
        }
    });

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoElem.srcObject = stream;
                let time = state.captureInterval;
                if (timerText) timerText.innerText = time;
                let count = 0;
                let pauseCount = 0;

                const intervalId = setInterval(() => {
                    if (pauseCount > 0) {
                        pauseCount -= 1;
                        if (pauseCount == 0) {
                            videoElem.style.opacity = 1;
                            if (timerText) timerText.style.opacity = 1;
                            const canvas = document.getElementById('tmpCanvas');
                            if (canvas) document.getElementById('videoContainer').removeChild(canvas);
                        }
                        return;
                    }
                    time -= 1;
                    if (timerText) timerText.innerHTML = time;
                    if (time == 0) {
                        takePhoto();
                        pauseCount = 2;
                        time = state.captureInterval;
                        if (timerText) {
                            timerText.innerHTML = time;
                            timerText.style.opacity = 0;
                        }
                        videoElem.style.opacity = 0;
                        count += 1;
                        if (count == 8) {
                            clearInterval(intervalId);
                            document.body.replaceChildren();
                            step3();
                        }
                    }
                }, 1000);

            })
            .catch((err) => {
                window.alert('something went wrong');
            })
    }
}

const takePhoto = () => {
    const audio = document.getElementById('audio');
    audio.play();
    const { width, height } = getImgSize(state.frameNum);
    const video = document.getElementById('videoElement');
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.id = 'tmpCanvas';
    const context = canvas.getContext("2d");
    context.translate(width, 0);
    context.scale(-1, 1);
    canvas.getContext("2d").drawImage(video, camInfo.paddingW, camInfo.paddingH, camInfo.camW, camInfo.camH, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    state.dataURLs.push(dataURL);
    document.getElementById('videoContainer').appendChild(canvas);
}