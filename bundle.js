!function(t){var e={};function r(a){if(e[a])return e[a].exports;var i=e[a]={i:a,l:!1,exports:{}};return t[a].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(a,i,function(e){return t[e]}.bind(null,i));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){t.exports=r(1)},function(e,r,a){"use strict";function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}a.r(r);class n{static info(t){n.level>=1&&n.log(t)}static debug(t){n.level>=2&&n.log(t)}static trace(t){n.level>=3&&n.log(t)}}function s(e){return n.trace("Creating notification..."),t.alert({message:e,duration:10,display:"success"})}async function o(t,e,r){return n.trace("Starting new set"),t.set("card","shared",{POMORELLO_ACTIVE:!0,POMORELLO_BREAK:!1,POMORELLO_START:Date.now(),POMORELLO_SET_LENGTH:e,POMORELLO_BREAK_LENGTH:r})}function c(t,e){return t.refresh?{refresh:t.refresh,...e}:e}function l(t){n.debug(`Displaying empty badge for card ${t.name}`);return c(t,{text:"No Pomodoro Active",color:"yellow"})}function d(t){n.debug(`Displaying status badge for card ${t.name}`);const e={text:`Pomodoro Active: ${t.timeStr()}`,color:"green"};return c(t,e)}function h(t){n.debug(`Displaying break badge for card ${t.name}`);const e={text:`Resting: ${t.timeStr()}`,color:"blue"};return c(t,e)}i(n,"level",3),i(n,"log",console.log);class u{constructor(t=10){n.trace(`Constructing new card with refresh ${t}`),this.is_active=!1,this.is_break=!1,this.start_ms=0,this.set_length=15e5,this.break_length=3e5,this.set_hist={},this.name="?",this.refresh=t}async fetch(t){n.trace("Fetching data");const e=t.card("name");let r=await t.getAll();r=r.card.shared||{},n.trace("Got data"),this.is_active=r.POMORELLO_ACTIVE||this.is_active,this.is_break=r.POMORELLO_BREAK||this.is_break,this.start_ms=r.POMORELLO_START||this.start_ms,this.set_length=r.POMORELLO_SET_LENGTH||this.set_length,this.break_length=r.POMORELLO_BREAK_LENGTH||this.break_length,this.set_hist=r.POMORELLO_SET_HISTORY||this.set_hist,this.name=(await e).name,n.info(JSON.stringify(this,null,2))}async sync(t){return n.trace(`Syncing card ${this.name}`),t.set("card","shared",{POMORELLO_ACTIVE:this.is_active,POMORELLO_BREAK:this.is_break,POMORELLO_START:this.start_ms,POMORELLO_SET_LENGTH:this.set_length,POMORELLO_BREAK_LENGTH:this.break_length,POMORELLO_SET_HISTORY:this.set_hist})}age(){const t=Date.now()-this.start_ms;return n.trace(`Computing age for card ${this.name}: ${t}`),t}timeStr(){let t;n.trace(`Formatting time for card ${this.name}`),this.is_active?t=this.set_length:this.is_break&&(t=this.break_length);const e=t-this.age();let r=Math.floor(e/1e3);return this.refresh&&(r=this.refresh*Math.ceil(r/this.refresh)),n.trace(`Formatting time for card ${this.name}: ${r} seconds`),`${(Math.floor(r/60)%60).toFixed(0).padStart(2,"0")}:${(r%60).toFixed(0).padStart(2,"0")}`}addSet(){n.trace(`Incrementing history of completed set for card ${this.name}`);const t=this.set_hist[this.set_length]||0;this.set_hist[this.set_length]=t+1}}function _(t,e){n.trace("Showing dropdown powerup menu"),t.popup({title:"Start a Pomodoro",items:[{text:"Plain 25/5",callback:(t,e)=>o(t,15e5,3e5)},{text:"Debug 1/0.5",callback:(t,e)=>o(t,6e4,3e4)}]})}window.TrelloPowerUp.initialize({"card-buttons":async(t,e)=>[{text:"Pomorello",callback:_}],"card-badges":(t,e)=>(n.trace("Loading card-badges"),[{dynamic:async()=>{const e=new u;n.debug("State initialized"),await e.fetch(t),n.info(`State retrieved for card ${e.name}`);const r=e.age();return e.is_active?(n.trace("Pomodoro active"),r>e.set_length?(n.trace("Pomodoro expired"),await async function(t,e){return n.trace(`Pomodoro for card ${e.name} finished.`),s(`Pomodoro for card ${e.name} complete.\nTime to take a break!`),e.is_active=!1,e.is_break=!0,e.start_ms=Date.now(),e.addSet(),e.sync(t)}(t,e),h(e)):(n.trace("Pomodoro in progress"),d(e))):e.is_break?(n.trace("Break active"),r>e.break_length?(n.trace("Break expired"),await async function(t,e){return n.trace(`Break for card ${e.name} finished.`),s(`Break for card ${e.name} has ended!`),e.is_active=!1,e.is_break=!1,e.sync(t)}(t,e),l(e)):(n.trace("Break in progress"),h(e))):(n.trace("No Pomodoro active"),l(e))}}]),"card-detail-badges":(t,e)=>(n.trace("Loading card-detail-badges"),[{dynamic:async()=>{const e=new u;await e.fetch(t);e.age();return e.is_active?d(e):e.is_break?h(e):l(e)}}])})}]);