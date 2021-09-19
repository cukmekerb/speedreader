var words = [];
var currentw = 0;
var paused = false;
var currentinterval;
var pauselengths;
var pauseatcomma;
var pauseatdot;

// keymaster custom filter:
key.filter = (event) => {
    var tagName = (event.target || event.srcElement).tagName;
    return (!(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA')) || (key.isPressed("command") && key.isPressed("enter")) || (key.isPressed("ctrl") && key.isPressed("enter"));
};

key("ctrl+enter, command+enter", () => {
    if (!paused && currentw == 0) {
        vroom();
    }
});

key("space", () => {
    paused = !paused;
    if (!paused) {
        document.getElementById("oph2").scrollIntoView();
    }
});

key("right", () => {
    if (currentw + 10 >= words.length) {
        currentw = words.length-1;
    }
    else {
        currentw += 10;
    }
    document.getElementById("oph2").innerText = words[currentw];
});

key("left", () => {
    if (currentw - 10 < 0) {
        currentw = 0;
    }
    else {
        currentw -= 10;
    }
    document.getElementById("oph2").innerText = words[currentw];
});

// prevent scrolling with spacebar
window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
});

function vroom() {
    if (document.getElementById("area").value && document.getElementById("area").value != "") {
        document.getElementById("oph2").scrollIntoView();
        document.getElementById("area").blur();
        words = document.getElementById("area").value.split(/\n|\s|-|—/);
        var speed = Number(document.getElementById("wpm").value);
        speed = 60 / speed * 1000;
        currentw = 0;
        if (currentinterval) {
            clearTimeout(currentinterval);
        }
        words = words.filter(function (val) { return val !== null && val != "" && val != "\n"; });
        document.getElementById("oph2").innerText = words[0];
        paused = false;
        setTimeout(() => { beginflashes(speed); }, 350);
    }
}

function beginflashes(speed) {
    var nspeed = speed;
    if (!paused) {
        if (currentw == words.length) {
            clearTimeout(currentinterval);
            currentinterval = null;
            currentw = 0;
            document.getElementById('signup').scrollIntoView();
            return;
        }
        document.getElementById("oph2").innerText = words[currentw];
        if (pauseatdot && words[currentw].match(/\.$|\。$/)) {
            nspeed += pauselengths.dot * 1000;
        }
        if (pauseatcomma && words[currentw].match(/\,$|\;$|\:$|\"$|\”$|\“$|\]$|\}$|\)$/)) {
            nspeed += pauselengths.comma * 1000;
        }
        currentw++;
    }
    currentinterval = setTimeout(() => {
        beginflashes(speed, pauseatdot, pauseatcomma);
    }, nspeed);
}

function showadv() {
    document.getElementById("advanceds").classList.remove("hidden");
    document.getElementById("advanced").innerHTML = "less";
    document.getElementById("advanced").setAttribute("onclick", "hidedadv()");
}

function hidedadv() {
    document.getElementById("advanceds").classList.add("hidden");
    document.getElementById("advanced").innerHTML = "more";
    document.getElementById("advanced").setAttribute("onclick", "showadv()");
}

function updatepauselen() {
    pauselengths = {
        comma: Number(document.getElementById("comma_pause_len").value),
        dot: Number(document.getElementById("dot_pause_len").value)
    };
    pauseatcomma = document.getElementById("pauseatcomma").checked;
    pauseatdot = document.getElementById("pauseatdot").checked;
    if (pauseatcomma) {
        document.getElementById("comma_div").classList.remove("fhidden");
    }
    else {
        document.getElementById("comma_div").classList.add("fhidden");
    }
    if (pauseatdot) {
        document.getElementById("dot_div").classList.remove("fhidden");
    }
    else {
        document.getElementById("dot_div").classList.add("fhidden");
    }
    var settings = {
        dotpause: pauseatdot,
        commapause: pauseatcomma,
        wpm: Number(document.getElementById("wpm").value),
        dpl: pauselengths.dot,
        cpl: pauselengths.comma
    };
    Cookies.set("settings", JSON.stringify(settings), { expires: 100000 });
}

function init() {
    document.getElementById('signup').scrollIntoView();
    if (Cookies.get("settings")) {
        settings = JSON.parse(Cookies.get("settings"));
        document.getElementById("pauseatdot").checked = settings.dotpause;
        document.getElementById("pauseatcomma").checked = settings.commapause;
        document.getElementById("wpm").value = settings.wpm;
        document.getElementById("dot_pause_len").value = settings.dpl;
        document.getElementById("comma_pause_len").value = settings.cpl;
    }
    updatepauselen();
}
