(this["webpackJsonppancake-frontend"]=this["webpackJsonppancake-frontend"]||[]).push([[17],{1412:function(e,t,n){"use strict";var i=n(11),c=n(0),r=n(2),a=n(1);t.a=function(e){var t=e.time,n=Math.floor((new Date).getTime()/1e3),d=Object(c.useState)(0),o=Object(i.a)(d,2),s=o[0],l=o[1],j=Object(c.useRef)(),b=Object(c.useState)("0"),x=Object(i.a)(b,2),h=x[0],f=x[1],p=Object(c.useState)("0"),u=Object(i.a)(p,2),O=u[0],g=u[1],m=Object(c.useState)("0"),w=Object(i.a)(m,2),k=w[0],y=w[1],v=Object(c.useState)("0"),A=Object(i.a)(v,2),S=A[0],C=A[1];return Object(c.useEffect)((function(){return t&&(j.current=setInterval((function(){l((function(e){return e>0?e-1:0}))}),1e3)),function(){t&&clearInterval(j.current)}}),[j,l,t]),Object(c.useEffect)((function(){if(t){var e=parseInt(t)-n;l(e>0?parseInt(t)-n:0)}}),[t,l,n]),Object(c.useEffect)((function(){var e=s%60,t=Math.floor(s/60%60),n=Math.floor(s/60/60%24),i=Math.floor(s/60/60/24);C(e<10?"0".concat(e):e.toString()),y(t<10?"0".concat(t):t.toString()),g(n<10?"0".concat(n):n.toString()),f(i<10?"0".concat(i):i.toString())}),[s]),Object(a.jsxs)(r.ib,{color:"#A7A7CC",fontSize:"12px",bold:!0,children:[h,":",O,":",k,":",S]})}},1777:function(e,t,n){"use strict";n.r(t);var i,c,r,a,d,o,s,l,j,b,x,h,f,p,u,O,g,m,w=n(11),k=n(8),y=n(0),v=n(26),A=n(2),S=n(1427),C=n(4),z=n(217),E=n(1412),T=n(1),D=C.default.div(i||(i=Object(k.a)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-flow: column;\n  color: white;\n  padding: 5px;\n  margin-top: 24px;\n  text-align: center;\n  font-weight: bold;\n  p {\n    line-height: 24px;\n  }\n  "," {\n    padding: 24px;\n  }\n"])),(function(e){return e.theme.mediaQueries.xs})),L=C.default.div(c||(c=Object(k.a)(["\n  width: 100%;\n"]))),I=Object(C.default)(A.ib)(r||(r=Object(k.a)(["\n  color: white;\n  font-weight: 600;\n  line-height: 1.5;\n  font-size: 20px;\n  text-align: left;\n  padding: 0px;\n  "," {\n    font-size: 30px;\n  }\n"])),(function(e){return e.theme.mediaQueries.sm})),H=C.default.div(a||(a=Object(k.a)(["\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  background: ",";\n  padding: 23px 28px;\n  border-radius: 5px;\n  margin-top: 30px;\n"])),(function(e){return e.theme.isDark?"#0E0E26":"#191C41"})),N=C.default.div(d||(d=Object(k.a)(["\n  display: flex;\n  gap: 20px;\n  justify-content: center;\n  flex-wrap: wrap;\n  width: 100%;\n"]))),R=C.default.div(o||(o=Object(k.a)(["\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-sizing: border-box;\n  border-radius: 10px;\n  background: ",";\n  min-width: 240px;\n  height: fit-content;\n  padding: 14px;\n  "," {\n    padding: 24px 34px;\n  }\n"])),(function(e){return e.theme.isDark?"#1A1A3A":"#2A2E60"}),(function(e){return e.theme.mediaQueries.lg})),M=Object(C.default)(R)(s||(s=Object(k.a)(["\n  width: auto;\n"]))),Q=Object(C.default)(R)(l||(l=Object(k.a)(["\n  width: 350px;\n  padding: 20px 14px;\n"]))),F=C.default.div(j||(j=Object(k.a)(["\n    display: flex;\n    align-items: center;\n    padding: 24px;\n    gap: 16px;\n"]))),P=C.default.div(b||(b=Object(k.a)(["\n    display: flex;\n    align-items: center;\n    width: 100%;\n    gap: 10px;\n    flex: 2;\n"]))),U=C.default.div(x||(x=Object(k.a)(["\n    img {\n        width: 64px;\n        height: 64px;\n        max-width: unset;\n    }\n"]))),X=C.default.div(h||(h=Object(k.a)(["\n    div:first-child {\n        font-weight: bold;\n        font-size: 20px;\n        text-transform: capitalize;\n    }\n    div:last-child {\n        font-weight: 600;\n        font-size: 14px;\n        white-space: nowrap;\n        color: #A7A7CC;\n        text-transform: capitalize;\n    }\n"]))),B=C.default.div(f||(f=Object(k.a)(["\n  display: flex;\n  justify-content: start;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 4px;\n  flex-direction: row;\n  div {\n    font-size: 14px;\n  }\n  div:last-child {\n    color: #f2c94c;\n    font-size: 12px;\n    font-weight: 600;\n    word-break: break-word;\n    text-align: left;\n  }\n  "," {\n    justify-content: space-between;\n  }\n"])),(function(e){return e.theme.mediaQueries.lg})),J=C.default.div(p||(p=Object(k.a)(["\n    display: flex;\n    justify-content: space-between;\n    width: 100%;\n"]))),K=C.default.div(u||(u=Object(k.a)(["\n    color: #A7A7CC;\n    font-weight: 600;\n    font-size: 14px;\n"]))),Y=C.default.div(O||(O=Object(k.a)(["\n    color: #F2C94C;\n    font-weight: 600;\n    font-size: 14px;\n"]))),V=C.default.div(g||(g=Object(k.a)(["\n    height: 1px;\n    background: rgba(255, 255, 255, 0.1);\n    margin: 16px 0px;\n"]))),q=C.default.div(m||(m=Object(k.a)(["\n  background: ",";\n  border-radius: 8px;\n  height: 100%;\n  max-height: 500px;\n  overflow: auto;\n  overflow-x: hidden;\n  margin-top: 10px;\n  & table {\n    background: transparent;\n    width: 100%;\n    & tr {\n      background: transparent;\n    }\n    & td {\n      padding: 8px;\n    }\n    & thead {\n      & td {\n        color: white;\n        font-size: 14px;\n        text-align: left;\n        vertical-align: middle;\n        background: transparent;\n        padding: 16px 8px;\n        font-weight: 600;\n        border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n        & > div > div {\n          font-size: 16px;\n          font-weight: 500;\n        }\n      }\n    }\n    & tbody {\n      & tr {\n        border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n        & h2 {\n          font-size: 12px;\n          line-height: 16px;\n          word-break: break-word;\n          font-weight: 600;\n          text-align: left;\n          &.success {\n            color: ",";\n          }\n          &.error {\n            color: ",";\n          }\n        }\n      }\n    }\n  }\n"])),(function(e){return e.theme.isDark?"#1A1A3A":"#2A2E60"}),(function(e){return e.theme.isDark?"#219653":"#77BF3E"}),(function(e){return e.theme.isDark?"#EB5757":"#F84364"}));t.default=function(){var e=Object(v.b)().t,t=(Object(A.wb)().isXl,Object(y.useState)(null)),n=Object(w.a)(t,2),i=n[0],c=n[1],r=Object(y.useState)(null),a=Object(w.a)(r,2),d=a[0],o=a[1];return Object(y.useEffect)((function(){c({id:0,tokenLogo:"https://sphynxtoken.co/static/media/Sphynx-Token-Transparent-1.020aae53.png",tokenName:"Sphynx Token",tokenSymbol:"SPHYNX",startTime:"1637691698",endTime:"1637791698",totalSupply:1e9,totalUnlocked:1e8,totalLocks:3,tokenAddress:"0xEE0C0E647d6E78d74C42E3747e0c38Cef41d6C88"});o([{date:"1637791698",amount:1e8},{date:"1637792698",amount:1e8},{date:"1637793698",amount:1e8},{date:"1637794698",amount:1e8},{date:"1637795698",amount:1e8},{date:"1637796698",amount:1e8},{date:"1637797698",amount:1e8}])}),[c]),Object(T.jsxs)(D,{children:[Object(T.jsx)(L,{children:Object(T.jsx)(A.H,{justifyContent:"space-between",alignItems:"center",flexDirection:"row",children:Object(T.jsxs)(A.H,{alignItems:"center",children:[Object(T.jsx)(S.a,{width:"80",height:"80"}),Object(T.jsx)(A.H,{flexDirection:"column",ml:"10px",children:Object(T.jsx)(I,{children:e("SPHYNX LOCKERS/DETAILS")})})]})})}),!i&&Object(T.jsx)(z.a,{}),i&&Object(T.jsx)(H,{children:Object(T.jsxs)(N,{children:[Object(T.jsxs)(M,{children:[Object(T.jsx)(F,{children:Object(T.jsxs)(P,{children:[Object(T.jsx)(U,{children:Object(T.jsx)("img",{src:i.tokenLogo,alt:"token icon"})}),Object(T.jsxs)(X,{children:[Object(T.jsx)(A.ib,{children:i.tokenSymbol}),Object(T.jsx)(A.ib,{children:i.tokenName})]})]})}),Object(T.jsxs)(B,{children:[Object(T.jsx)(A.ib,{color:"#A7A7CC",bold:!0,children:"Token Address:"}),Object(T.jsx)(A.ib,{children:i.tokenAddress})]}),Object(T.jsx)(V,{}),Object(T.jsxs)(J,{children:[Object(T.jsx)(K,{children:"Lock Timer:"}),Object(T.jsx)(Y,{children:Object(T.jsx)(E.a,{time:i.endTime})})]}),Object(T.jsx)(V,{}),Object(T.jsxs)(J,{children:[Object(T.jsx)(K,{children:"Total Supply of Tokens:"}),Object(T.jsx)(Y,{children:i.totalSupply})]}),Object(T.jsx)(V,{}),Object(T.jsxs)(J,{children:[Object(T.jsx)(K,{children:"Total Locked Tokens:"}),Object(T.jsx)(Y,{children:i.totalUnlocked})]}),Object(T.jsx)(V,{}),Object(T.jsxs)(J,{children:[Object(T.jsx)(K,{style:{marginRight:"5px"},children:"Unlock Date:"}),Object(T.jsx)(Y,{children:new Date(1e3*parseInt(i.startTime)).toLocaleString()})]}),Object(T.jsx)(V,{}),Object(T.jsxs)(J,{children:[Object(T.jsx)(K,{children:"Total Locks:"}),Object(T.jsx)(Y,{children:i.totalLocks})]})]}),Object(T.jsxs)(Q,{children:[Object(T.jsx)(A.ib,{fontSize:"20px",bold:!0,children:"CPK Vesting Schedule"}),Object(T.jsx)(q,{children:Object(T.jsxs)("table",{children:[Object(T.jsx)("thead",{children:Object(T.jsxs)("tr",{children:[Object(T.jsx)("td",{style:{width:"15%",textAlign:"center"},children:e("No")}),Object(T.jsx)("td",{style:{width:"50%"},children:e("Estimated Release Date")}),Object(T.jsx)("td",{style:{width:"35%"},children:e("Token Released")})]})}),Object(T.jsx)("tbody",{children:d.map((function(e,t){return Object(T.jsxs)("tr",{children:[Object(T.jsx)("td",{style:{width:"15%"},children:Object(T.jsx)(A.ib,{fontSize:"12px",color:"#A7A7CC",style:{textAlign:"center"},children:t+1})}),Object(T.jsx)("td",{style:{width:"50%"},children:Object(T.jsx)(A.ib,{fontSize:"12px",color:"#A7A7CC",style:{textAlign:"left"},children:new Date(1e3*parseInt(e.date)).toLocaleString()})}),Object(T.jsx)("td",{style:{width:"35%"},children:Object(T.jsxs)(A.ib,{fontSize:"12px",color:"#A7A7CC",style:{textAlign:"left"},children:[" ",e.amount]})})]},"key")}))})]})})]})]})})]})}}}]);