"use strict";(function(){let e=document.getElementById("presentButton");let n=document.getElementById("edit");let t=document.getElementById("present");let i=function(e){let n=e.split(" (")[0];return n.indexOf("://")>=0&&n.match(/\s/)===null};let l=function(e,n){let t=e.split("\n");let l=document.createElement("section");let d;let s;let c=true;let r=function(){if(d){l.appendChild(d);d=undefined}};let a=function(){if(s){l.appendChild(s);s=undefined}};for(let u=0;u<t.length;u++){let o=t[u].trim();if(u===0){if(i(o)){let m=o.split(" (");let p=m[0];let f=m[1].slice(0,m[1].length-1);let g=document.createElement("p");g.innerText="Image: "+f;l.appendChild(g);let L=document.createElement("div");L.classList.add("full-bleed");L.style.backgroundImage="url("+p+")";l.appendChild(L)}else{let g=document.createElement(n===0?"h1":"h2");g.innerText=o;l.appendChild(g)}}else{if(o[0]==="-"||o[0]==="*"){r();if(!s){s=document.createElement("ul");c=false}let g=document.createElement("li");g.innerText=o.slice(1).trim();s.appendChild(g)}else if(i(o)){a();if(!d){d=document.createElement("ul");d.classList.add("gallery");c=false}let m=o.split(" (");let L=new Image;L.src=m[0];L.alt=m[1].slice(0,m[1].length-1);let g=document.createElement("li");g.appendChild(L);d.appendChild(g)}else{a();r();let g=document.createElement("p");g.innerText=o;l.appendChild(g)}}}a();r();if(c){l.classList.add("slide--centered")}return l};let d=function(){let e=n.value;let i=e.split("\n\n");let d=document.createElement("main");for(let s=0;s<i.length;s++){d.appendChild(l(i[s],s))}let c=document.createElement("section");c.classList.add("slide--end");d.appendChild(c);t.innerHTML=d.innerHTML;t.classList.add("u-visible");t.querySelector("section").classList.add("current")};let s=function(){let e=t.querySelector(".current");if(e.nextSibling){e.classList.add("previous");e.classList.remove("current");e.nextSibling.classList.add("current")}};let c=function(){let e=t.querySelector(".current");if(e.previousSibling){e.classList.remove("current");e.previousSibling.classList.add("current");if(e.previousSibling.previousSibling){e.previousSibling.previousSibling.classList.add("previous")}}};let r=function(){t.innerHTML="";t.classList.remove("u-visible")};e.addEventListener("click",d);t.addEventListener("click",s);let a={27:r,37:c,38:c,39:s,40:s};document.addEventListener("keydown",function(e){if(a[e.keyCode]){a[e.keyCode]()}})})();