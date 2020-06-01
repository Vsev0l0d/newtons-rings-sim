const
    rectWidth = 500,
    rectHeight = 500,
    rectX = 0,
    rectY = 0,
    rectCenterW = (rectWidth - rectX) / 2,
    rectCenterH = (rectHeight - rectY) / 2,
    pixelsInMetre = (rectWidth / 2) * 10 / 1e-2, // половина стороны квадрата = 10 см
    drawingPixelStep = 0.5; // лучше всего работает при 0.5, при 1 тускловато (и есть артефакты)
let
    isPortableDevice = true,
    clickX = rectCenterW,
    clickY = rectCenterH

function update() {
    let wavelength = +Wavelength.value * 1e-9, // нанометры (10^-9)
        n = +RefractiveIndex.value,
        ctx = Grad.getContext("2d"),
        opticalPathDifference,
        intensity,
        passing = +Passing.value,
        lensRadius = +RadiusLens.value; // метры?

    // Черный квадрат (фон)
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    ctx.lineWidth = 1;

    // Кольца
    for (let rInPixels = 0; rInPixels < rectWidth / 2 * Math.sqrt(2); rInPixels += drawingPixelStep) { // здесь r в пикселях, а не метрах!
        opticalPathDifference =
            calculateOpticalPathDifference(passing, pixelsToMetres(rInPixels, pixelsInMetre),
                lensRadius, n, wavelength) // а вот тут в метрах
        intensity = calculateIntensity(opticalPathDifference, wavelength)
        ctx.beginPath()
        ctx.strokeStyle = wavelengthToColor(wavelength, intensity);
        ctx.arc(rectCenterW, rectCenterH, rInPixels, 0, 2 * Math.PI);
        ctx.stroke()
    }

    // Радиус
    ctx.strokeStyle = "white"
    ctx.beginPath();
    ctx.moveTo(rectCenterW,rectCenterH)
    ctx.lineTo(clickX, clickY)
    ctx.stroke()
}

function pixelsToMetres(inPixels, pixelsInMetre) {
    return inPixels / pixelsInMetre
}

function calculateIntensity(Delta, waveLength) {
    const maxIntensity = 0.3;
    return maxIntensity * (1 + Math.cos(2 * Math.PI * Delta / waveLength))
}

function calculateOpticalPathDifference(through, r, R, n, wavelength) {
    return r * r / R * n + through * wavelength / 2;
}

function wavelengthToColor(wavelength, intensity) {
    let R, G, B, alpha, wl = wavelength * 1e9;

    if (wl >= 380 && wl < 440) {
        R = -1 * (wl - 440) / (440 - 380);
        G = 0;
        B = 1;
    } else if (wl >= 440 && wl < 490) {
        R = 0;
        G = (wl - 440) / (490 - 440);
        B = 1;
    } else if (wl >= 490 && wl < 510) {
        R = 0;
        G = 1;
        B = -1 * (wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
        R = (wl - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (wl >= 580 && wl < 645) {
        R = 1;
        G = -1 * (wl - 645) / (645 - 580);
        B = 0.0;
    } else if (wl >= 645 && wl <= 780) {
        R = 1;
        G = 0;
        B = 0;
    } else {
        R = 0;
        G = 0;
        B = 0;
    }

    // Интенсивность меньше на краях спектра
    if (wl > 780 || wl < 380) {
        alpha = 0;
    } else if (wl > 700) {
        alpha = (780 - wl) / (780 - 700);
    } else if (wl < 420) {
        alpha = (wl - 380) / (420 - 380);
    } else {
        alpha = 1;
    }

    let alphaModifiedByIntensity = alpha * intensity

    return `rgba(${R * 255}, ${G * 255}, ${B * 255}, ${alphaModifiedByIntensity})`
}