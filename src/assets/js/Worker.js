var i = 0;


export const timedCount = () => {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();