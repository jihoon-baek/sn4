import state from './state';
import { getImgSize, makeButton } from './utils';
import { grayscaleFilter, brightnessFilter, colorEnhanceFilter } from './filters';
import html2canvas from 'html2canvas';
import { renderFrame } from './frameRenderer';

const getDateStr = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2,'0');
    const day = `${date.getDate()}`.padStart(2,'0');
    return `${year}${month}${day}`;
}

const colors = [
// bgName, textColor, bgColor
    {name: 'black', textColor: 'white', bgColor: '#000000'},
    {name: 'white', textColor: 'black', bgColor: '#FFFFFF'},
    {name: 'pink', textColor: 'white', bgColor: 'rgb(245 188 188)'},
    {name: 'pink beige', textColor: 'white', bgColor: 'rgb(215 197 197)'},
    {name: 'blue', textColor: 'white', bgColor: 'rgb(100 150 213)'},
    {name: 'deep blue', textColor: 'white', bgColor: 'rgb(19 39 72)'},
    {name: 'skyblue', textColor: 'white', bgColor: 'rgb(188 224 245)'},
    {name: 'purple', textColor: 'white', bgColor: 'rgb(208 182 239)'},
    {name: 'light green', textColor: 'white', bgColor: 'rgb(194 228 160)'},
    {name: 'yellow', textColor: 'white', bgColor: 'rgb(255 224 132)'},
]

const filters = [
        {name: '원본', func: (pixels) => {return pixels}},
        {name: '밝게', func: brightnessFilter},
        {name: '흑백', func: grayscaleFilter},
        {name: '쨍하게', func: colorEnhanceFilter},
]
export default () => {
    step4();
}


const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = window.atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const exportElementAsPNG = (el, filename) => {
	html2canvas(el, { scale: 6 }).then((canvas) => {
		const image = canvas.toDataURL('image/png', 1);
		
		// 1. Download file locally
		const link = window.document.createElement('a');
		link.style = 'display:none;';
		link.download = filename + '.png';
		link.href = image;
		link.click();

		// 2. Trigger native Web Share API (which handles AirDrop / local share)
		try {
			const file = dataURLtoFile(image, filename + '.png');
			if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
				navigator.share({
					files: [file],
					title: '사노네컷',
					text: '사노네컷 사진입니다!'
				}).catch(err => {
					console.log('Share canceled or failed:', err);
				});
			} else {
				console.log('Sharing is not supported on this browser or cannot share files.');
			}
		} catch (e) {
			console.error('Sharing failed:', e);
		}
	});
};

const step4 = () =>{
    let timerIntervalId;

    const goToOpening = () => {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }
        window.location.reload();
    };

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
    msg.innerHTML = `<span>필터와 배경을 선택해주세요</span><span id="timerText" style="font-size: 60px; color: #e74c3c; font-family: 'LOTTERIACHAB', sans-serif; min-width: 60px; text-shadow: 0 0 5px rgba(255,255,255,0.8);">100</span>`;
    document.body.appendChild(msg);

    // 100 seconds timer
    let timeLeft = 100;
    const timerText = document.getElementById('timerText');
    timerIntervalId = setInterval(() => {
        timeLeft -= 1;
        if (timerText) {
            timerText.innerText = timeLeft;
        }
        if (timeLeft <= 0) {
            clearInterval(timerIntervalId);
            goToOpening();
        }
    }, 1000);

    const mainWrapper = document.createElement('div');
    mainWrapper.id = 'mainDesignWrapper';
    mainWrapper.style.position = 'absolute';
    mainWrapper.style.display = 'flex';
    mainWrapper.style.flexDirection = 'row';
    mainWrapper.style.alignItems = 'center';
    mainWrapper.style.justifyContent = 'center';
    mainWrapper.style.width = '950px';
    mainWrapper.style.height = '550px';
    mainWrapper.style.top = 'calc(100px + (100vh - 230px) / 2)';
    mainWrapper.style.left = '50%';
    mainWrapper.style.transform = 'translate(-50%, -50%) scale(1)';
    mainWrapper.style.transformOrigin = 'center center';
    mainWrapper.style.gap = '80px';
    mainWrapper.style.boxSizing = 'border-box';
    mainWrapper.style.overflow = 'hidden';

    const previewWrapper = document.createElement('div');
    previewWrapper.style.display = 'flex';
    previewWrapper.style.alignItems = 'center';
    previewWrapper.style.justifyContent = 'center';
    previewWrapper.style.flexShrink = '0';

    const menuWrapper = document.createElement('div');
    menuWrapper.style.display = 'flex';
    menuWrapper.style.flexDirection = 'column';
    menuWrapper.style.alignItems = 'center';
    menuWrapper.style.justifyContent = 'center';
    menuWrapper.style.gap = '30px';
    menuWrapper.style.flexShrink = '0';

    const preview = createPreview();
    previewWrapper.appendChild(preview);

    const bgMenu = createBgMenu();
    const filterMenu = createFilterMenu();
    menuWrapper.appendChild(bgMenu);
    menuWrapper.appendChild(filterMenu);

    mainWrapper.appendChild(previewWrapper);
    mainWrapper.appendChild(menuWrapper);
    document.body.appendChild(mainWrapper);

    const btnContainer = document.createElement('div');
    btnContainer.style.position = 'absolute';
    btnContainer.style.bottom = '50px';
    btnContainer.style.left = '50%';
    btnContainer.style.transform = 'translateX(-50%)';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '20px';
    btnContainer.style.zIndex = '100';

    const ShareBtn = makeButton('Share (AirDrop)', () => {
        exportElementAsPNG(document.querySelector('#preview'), `${getDateStr()}_${state.frameNum}_${colors[state.bg].name}`);
    });
    ShareBtn.style.position = 'static';
    ShareBtn.style.margin = '0';
    ShareBtn.style.width = '200px';
    ShareBtn.style.height = '60px';
    ShareBtn.style.fontSize = '22px';
    ShareBtn.style.borderRadius = '30px';

    const HomeBtn = makeButton('처음으로', () => {
        goToOpening();
    });
    HomeBtn.style.position = 'static';
    HomeBtn.style.margin = '0';
    HomeBtn.style.width = '150px';
    HomeBtn.style.height = '60px';
    HomeBtn.style.fontSize = '22px';
    HomeBtn.style.borderRadius = '30px';
    HomeBtn.style.backgroundColor = '#e74c3c';
    HomeBtn.style.color = '#fff';
    HomeBtn.style.borderColor = '#e74c3c';

    btnContainer.appendChild(ShareBtn);
    btnContainer.appendChild(HomeBtn);
    document.body.appendChild(btnContainer);

    // Responsive scaling script (ensures everything fits inside viewport without scrollbars)
    const fitLayout = () => {
        const wrapper = document.getElementById('mainDesignWrapper');
        if (!wrapper) {
            window.removeEventListener('resize', fitLayout);
            return;
        }
        const baseW = 950;
        const baseH = 550;
        const winW = window.innerWidth - 40;
        const winH = window.innerHeight - 230; // height of viewport area between title and download button
        
        const scale = Math.min(winW / baseW, winH / baseH, 1);
        wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    window.addEventListener('resize', fitLayout);
    fitLayout(); // Trigger initial sizing
}

const createFilterMenu = () => {
    const filterMenu = document.createElement('div');
    filterMenu.style.gridTemplateColumns = 'repeat(2, 1fr)';
    filterMenu.style.gap = '15px';

    filters.forEach((filter, idx)=>{
        const option = document.createElement('div');
        option.innerText = filter.name;
        option.style.fontFamily = 'NEXON Lv1 Gothic OTF';
        option.style.textAlign = 'center';
        option.id = 'filter'+idx;
        option.style.width = '100px';
        option.style.height = '100px';
        option.style.lineHeight = '100px';
        option.style.backgroundColor = idx != 0 ? 'white': 'gray';
        option.style.borderRadius = '30px';
        option.style.cursor = 'pointer';
        option.addEventListener('click', () => {selectFilter(idx)});
        filterMenu.appendChild(option);
    });

    filterMenu.style.position = 'relative';
    filterMenu.style.width = '240px';
    filterMenu.style.display = 'grid';

    return filterMenu;
}

const selectFilter = (idx) => {
    for (let i = 0; i < filters.length; i += 1) {
        if (i == idx) {
            document.querySelector('#filter' + i).style.backgroundColor = 'gray';
        } else {
            document.querySelector('#filter' + i).style.backgroundColor = 'white';
        }
    }

    state.filter = idx;
    const canvas = document.getElementsByClassName('cvs');
    Array.from(canvas).forEach((cvs, i)=>{
        const pixels = state.originPixels[i];
        const pixels_ = new ImageData(
            new Uint8ClampedArray(pixels.data),
            pixels.width,
            pixels.height
          )
        const filteredData = filters[idx].func(pixels_);
        const ctx = cvs.getContext('2d');
        ctx.putImageData(filteredData, 0 , 0);
    });
}

const changeBg = (dir) => {
    // change state
    state.bg += dir * 1;
    if (state.bg < 0) state.bg = colors.length - 1;
    if (state.bg >= colors.length) state.bg = 0;

    // change view
    const bgColorPreview = document.querySelector('#bgColorPreview');
    bgColorPreview.innerText = colors[state.bg].name;
    bgColorPreview.style.color = colors[state.bg].textColor;

    bgColorPreview.style.backgroundColor = colors[state.bg].bgColor;
    document.querySelector('#preview').style.backgroundColor = colors[state.bg].bgColor;
    document.querySelector('#logoText').style.color =  colors[state.bg].textColor;
    document.querySelector('#dateText').style.color =  colors[state.bg].textColor;
}

const createBgMenu = () => {
    const bgMenu = document.createElement('div');
    const leftBtn = document.createElement('div');
    leftBtn.innerText = '◀︎';
    leftBtn.style.textAlign = 'center';
    leftBtn.style.height = '120px';
    leftBtn.style.lineHeight = '120px';
    leftBtn.style.cursor = 'pointer';
    leftBtn.color = 'gray';
    leftBtn.addEventListener('click', () => {changeBg(-1);})

    const rightBtn = document.createElement('div');
    rightBtn.innerText = '▶︎';
    rightBtn.style.textAlign = 'center';
    rightBtn.style.height = '120px';
    rightBtn.style.lineHeight = '120px';
    rightBtn.style.cursor = 'pointer';
    rightBtn.color = 'black';
    rightBtn.addEventListener('click', () => {changeBg(+1);})

    const bgColorPreview = document.createElement('div');
    bgColorPreview.id = 'bgColorPreview';
    bgColorPreview.innerText = colors[0].name;
    bgColorPreview.style.color = colors[0].textColor;
    bgColorPreview.style.backgroundColor = colors[0].bgColor;
    bgColorPreview.style.textAlign = 'center';
    bgColorPreview.style.fontFamily = 'NEXON Lv1 Gothic OTF';
    bgColorPreview.style.width = '120px';
    bgColorPreview.style.height = '120px';
    bgColorPreview.style.borderRadius = '60px';
    bgColorPreview.style.lineHeight = '120px';
    bgMenu.appendChild(leftBtn);
    bgMenu.appendChild(bgColorPreview);
    bgMenu.appendChild(rightBtn);
    bgMenu.style.position = 'relative';
    bgMenu.style.width = '300px';
    bgMenu.style.display = 'grid';
    bgMenu.style.gridTemplateColumns = '60px 120px 60px';
    document.body.appendChild(bgMenu);

    return bgMenu;
}

const createPreview = () => {
    const { width: imgW, height: imgH } = getImgSize(state.frameNum);
    const canvasElements = [];
    state.originPixels = [];

    state.dataURLs.forEach((url, idx) => {
        if (!state.selectedIdx.has(idx)) return;
        const img = new Image;
        img.src = url;
        const canvas = document.createElement('canvas');
        canvas.className = 'cvs';
        canvas.width = imgW;
        canvas.height = imgH;
        const ctx = canvas.getContext('2d');
        img.onload = () => {
            ctx.drawImage(img, 0, 0, imgW, imgH);
            state.originPixels.push(ctx.getImageData(0, 0, imgW, imgH));
        };
        canvasElements.push(canvas);
    });

    const preview = renderFrame(state.frameNum, state.bg, 0.3, canvasElements);
    preview.id = 'preview';
    preview.style.margin = '0 auto';

    return preview;
}
