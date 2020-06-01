const
    RefractiveIndex = document.getElementById('N'),
    Wavelength = document.getElementById("lambda"),
    Grad = document.getElementById("grad"),
    RadiusLens = document.getElementById("Radius"),
    Passing = document.getElementById("through"),
    Reflected = document.getElementById("reflected")
DeleteButton = document.getElementById("deleteButton")

// Для компьютеров

RefractiveIndex.onmousemove = () => {
    isPortableDevice = false;
    document.getElementById("labelN").innerText = "Показатель преломления среды: " + Number(RefractiveIndex.value).toFixed(2);
    update();
};

Wavelength.onmousemove = () => {
    isPortableDevice = false;
    document.getElementById("labelLambda").innerText = "Длина волны: " + Wavelength.value + " нм";
    update();
};

RadiusLens.onmousemove = () => {
    isPortableDevice = false;
    document.getElementById("labelRadius").innerText = "Радиус линзы: " + Number(RadiusLens.value).toFixed(2) + " м";
    update();
};

// Общее

Passing.onchange = () => {
    Passing.value = 1
    update();
}

Reflected.onchange = () => {
    Passing.value = 0
    update();
}

Grad.onclick = (e) => {
    clickX = e.pageX - Grad.offsetLeft
    clickY = e.pageY - Grad.offsetTop
    let distance = Math.round(Math.sqrt(Math.pow(rectCenterW - clickX, 2) + Math.pow(rectCenterH - clickY, 2)))
    if (distance !== 0) {
        DeleteButton.hidden = false;
        document.getElementById("distance").innerText ="\nРасстояние от центра: " +
            (pixelsToMetres(distance.toString()) * 1e3).toFixed(3) + " мм"
    } else {
        document.getElementById("distance").innerText ="\nКликните на одно из колец"
    }
    update()
}

DeleteButton.onclick = () => {
    clickX = rectCenterW
    clickY = rectCenterH
    document.getElementById("distance").innerText ="\nКликните на одно из колец"
    DeleteButton.hidden = true;
    update()
}

// Для мобильных устройств

RefractiveIndex.onchange = () => {
    if (!isPortableDevice) return;
    document.getElementById("labelN").innerText = "Показатель преломления среды: " + Number(RefractiveIndex.value).toFixed(2);
    update();
};

Wavelength.onchange = () => {
    if (!isPortableDevice) return;
    document.getElementById("labelLambda").innerText = "Длина волны: " + Wavelength.value + " нм";
    update();
};

RadiusLens.onchange = () => {
    if (!isPortableDevice) return;
    document.getElementById("labelRadius").innerText = "Радиус линзы: " + Number(RadiusLens.value).toFixed(2) + " м";
    update();
};

// При запуске

window.onload = () => update();