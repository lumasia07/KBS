import{r as c,j as n,c as ft,b as Jt,t as _,u as Zt,H as en,L as bt}from"./app-DMq6RBOi.js";import{d as kt,R as tn,I as nn,c as sn,b as on,A as an}from"./app-layout-CVPkjPl9.js";import{c as rn,u as ht,a as Rt,B as pe,f as yt,b as v}from"./button-BrQXJToA.js";import{d as ln,c as ue,C as fe,b as vt,a as _t,A as wt,f as he,e as xe}from"./alert-C6R-5WHg.js";import{S as jt}from"./separator-CISGm9ft.js";import{B as cn}from"./badge-BYcLIFX_.js";import{d as dn,u as mn,c as pt,a as pn}from"./Combination-C5EFvyZV.js";import{u as un}from"./index-DQRTbMTN.js";import{c as fn}from"./createLucideIcon-C7CsTSWJ.js";import{L as Ze}from"./label-DFXtWGG_.js";import{I as hn}from"./input-CKHNRcSU.js";import{S as Je,L as xn}from"./sweetalert2.esm.all-Dp05uZKx.js";import{C as Pt}from"./circle-alert-CSadlz_2.js";import{C as ge}from"./circle-check-big-AORnbLdb.js";import{C as Nt}from"./clock-B4I2Wuku.js";import{D as Ct}from"./download-CXx-nRUR.js";import{T as gn}from"./truck-CIh_BrgX.js";import{F as bn}from"./x-DNmdaJ16.js";/* empty css            */import"./index-BVt7M_Tx.js";import"./index-EBLA1b0H.js";import"./credit-card-DvK2LBrL.js";const yn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],vn=fn("circle",yn);function It(s,e=[]){let t=[];function r(l,i){const d=c.createContext(i),a=t.length;t=[...t,i];const m=u=>{const{scope:f,children:h,...p}=u,y=f?.[s]?.[a]||d,g=c.useMemo(()=>p,Object.values(p));return n.jsx(y.Provider,{value:g,children:h})};m.displayName=l+"Provider";function x(u,f){const h=f?.[s]?.[a]||d,p=c.useContext(h);if(p)return p;if(i!==void 0)return i;throw new Error(`\`${u}\` must be used within \`${l}\``)}return[m,x]}const o=()=>{const l=t.map(i=>c.createContext(i));return function(d){const a=d?.[s]||l;return c.useMemo(()=>({[`__scope${s}`]:{...d,[s]:a}}),[d,a])}};return o.scopeName=s,[r,_n(o,...e)]}function _n(...s){const e=s[0];if(s.length===1)return e;const t=()=>{const r=s.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(l){const i=r.reduce((d,{useScope:a,scopeName:m})=>{const u=a(l)[`__scope${m}`];return{...d,...u}},{});return c.useMemo(()=>({[`__scope${e.scopeName}`]:i}),[i])}};return t.scopeName=e.scopeName,t}function wn(s){const e=jn(s),t=c.forwardRef((r,o)=>{const{children:l,...i}=r,d=c.Children.toArray(l),a=d.find(Cn);if(a){const m=a.props.children,x=d.map(u=>u===a?c.Children.count(m)>1?c.Children.only(null):c.isValidElement(m)?m.props.children:null:u);return n.jsx(e,{...i,ref:o,children:c.isValidElement(m)?c.cloneElement(m,void 0,x):null})}return n.jsx(e,{...i,ref:o,children:l})});return t.displayName=`${s}.Slot`,t}function jn(s){const e=c.forwardRef((t,r)=>{const{children:o,...l}=t;if(c.isValidElement(o)){const i=kn(o),d=Sn(l,o.props);return o.type!==c.Fragment&&(d.ref=r?rn(r,i):i),c.cloneElement(o,d)}return c.Children.count(o)>1?c.Children.only(null):null});return e.displayName=`${s}.SlotClone`,e}var Nn=Symbol("radix.slottable");function Cn(s){return c.isValidElement(s)&&typeof s.type=="function"&&"__radixId"in s.type&&s.type.__radixId===Nn}function Sn(s,e){const t={...e};for(const r in e){const o=s[r],l=e[r];/^on[A-Z]/.test(r)?o&&l?t[r]=(...d)=>{const a=l(...d);return o(...d),a}:o&&(t[r]=o):r==="style"?t[r]={...o,...l}:r==="className"&&(t[r]=[o,l].filter(Boolean).join(" "))}return{...s,...t}}function kn(s){let e=Object.getOwnPropertyDescriptor(s.props,"ref")?.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?s.ref:(e=Object.getOwnPropertyDescriptor(s,"ref")?.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?s.props.ref:s.props.ref||s.ref)}var Rn=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],et=Rn.reduce((s,e)=>{const t=wn(`Primitive.${e}`),r=c.forwardRef((o,l)=>{const{asChild:i,...d}=o,a=i?t:e;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),n.jsx(a,{...d,ref:l})});return r.displayName=`Primitive.${e}`,{...s,[e]:r}},{}),xt="Radio",[Pn,At]=It(xt),[In,An]=Pn(xt),Dt=c.forwardRef((s,e)=>{const{__scopeRadio:t,name:r,checked:o=!1,required:l,disabled:i,value:d="on",onCheck:a,form:m,...x}=s,[u,f]=c.useState(null),h=ht(e,g=>f(g)),p=c.useRef(!1),y=u?m||!!u.closest("form"):!0;return n.jsxs(In,{scope:t,checked:o,disabled:i,children:[n.jsx(et.button,{type:"button",role:"radio","aria-checked":o,"data-state":$t(o),"data-disabled":i?"":void 0,disabled:i,value:d,...x,ref:h,onClick:pt(s.onClick,g=>{o||a?.(),y&&(p.current=g.isPropagationStopped(),p.current||g.stopPropagation())})}),y&&n.jsx(Bt,{control:u,bubbles:!p.current,name:r,value:d,checked:o,required:l,disabled:i,form:m,style:{transform:"translateX(-100%)"}})]})});Dt.displayName=xt;var Tt="RadioIndicator",Et=c.forwardRef((s,e)=>{const{__scopeRadio:t,forceMount:r,...o}=s,l=An(Tt,t);return n.jsx(sn,{present:r||l.checked,children:n.jsx(et.span,{"data-state":$t(l.checked),"data-disabled":l.disabled?"":void 0,...o,ref:e})})});Et.displayName=Tt;var Dn="RadioBubbleInput",Bt=c.forwardRef(({__scopeRadio:s,control:e,checked:t,bubbles:r=!0,...o},l)=>{const i=c.useRef(null),d=ht(i,l),a=un(t),m=pn(e);return c.useEffect(()=>{const x=i.current;if(!x)return;const u=window.HTMLInputElement.prototype,h=Object.getOwnPropertyDescriptor(u,"checked").set;if(a!==t&&h){const p=new Event("click",{bubbles:r});h.call(x,t),x.dispatchEvent(p)}},[a,t,r]),n.jsx(et.input,{type:"radio","aria-hidden":!0,defaultChecked:t,...o,tabIndex:-1,ref:d,style:{...o.style,...m,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});Bt.displayName=Dn;function $t(s){return s?"checked":"unchecked"}var Tn=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],tt="RadioGroup",[En]=It(tt,[kt,At]),Ot=kt(),Ft=At(),[Bn,$n]=En(tt),Mt=c.forwardRef((s,e)=>{const{__scopeRadioGroup:t,name:r,defaultValue:o,value:l,required:i=!1,disabled:d=!1,orientation:a,dir:m,loop:x=!0,onValueChange:u,...f}=s,h=Ot(t),p=dn(m),[y,g]=mn({prop:l,defaultProp:o??null,onChange:u,caller:tt});return n.jsx(Bn,{scope:t,name:r,required:i,disabled:d,value:y,onValueChange:g,children:n.jsx(tn,{asChild:!0,...h,orientation:a,dir:p,loop:x,children:n.jsx(et.div,{role:"radiogroup","aria-required":i,"aria-orientation":a,"data-disabled":d?"":void 0,dir:p,...f,ref:e})})})});Mt.displayName=tt;var Lt="RadioGroupItem",Gt=c.forwardRef((s,e)=>{const{__scopeRadioGroup:t,disabled:r,...o}=s,l=$n(Lt,t),i=l.disabled||r,d=Ot(t),a=Ft(t),m=c.useRef(null),x=ht(e,m),u=l.value===o.value,f=c.useRef(!1);return c.useEffect(()=>{const h=y=>{Tn.includes(y.key)&&(f.current=!0)},p=()=>f.current=!1;return document.addEventListener("keydown",h),document.addEventListener("keyup",p),()=>{document.removeEventListener("keydown",h),document.removeEventListener("keyup",p)}},[]),n.jsx(nn,{asChild:!0,...d,focusable:!i,active:u,children:n.jsx(Dt,{disabled:i,required:l.required,checked:u,...a,...o,name:l.name,ref:x,onCheck:()=>l.onValueChange(o.value),onKeyDown:pt(h=>{h.key==="Enter"&&h.preventDefault()}),onFocus:pt(o.onFocus,()=>{f.current&&m.current?.click()})})})});Gt.displayName=Lt;var On="RadioGroupIndicator",zt=c.forwardRef((s,e)=>{const{__scopeRadioGroup:t,...r}=s,o=Ft(t);return n.jsx(Et,{...o,...r,ref:e})});zt.displayName=On;var qt=Mt,Vt=Gt,Fn=zt;const ut=c.forwardRef((s,e)=>{const t=ft.c(9);let r,o;t[0]!==s?({className:r,...o}=s,t[0]=s,t[1]=r,t[2]=o):(r=t[1],o=t[2]);let l;t[3]!==r?(l=Rt("grid gap-2",r),t[3]=r,t[4]=l):l=t[4];let i;return t[5]!==o||t[6]!==e||t[7]!==l?(i=n.jsx(qt,{className:l,...o,ref:e}),t[5]=o,t[6]=e,t[7]=l,t[8]=i):i=t[8],i});ut.displayName=qt.displayName;const gt=c.forwardRef((s,e)=>{const t=ft.c(10);let r,o;t[0]!==s?({className:r,...o}=s,t[0]=s,t[1]=r,t[2]=o):(r=t[1],o=t[2]);let l;t[3]!==r?(l=Rt("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",r),t[3]=r,t[4]=l):l=t[4];let i;t[5]===Symbol.for("react.memo_cache_sentinel")?(i=n.jsx(Fn,{className:"flex items-center justify-center",children:n.jsx(vn,{className:"h-2.5 w-2.5 fill-current text-current"})}),t[5]=i):i=t[5];let d;return t[6]!==o||t[7]!==e||t[8]!==l?(d=n.jsx(Vt,{ref:e,className:l,...o,children:i}),t[6]=o,t[7]=e,t[8]=l,t[9]=d):d=t[9],d});gt.displayName=Vt.displayName;const Mn=()=>{const s=a=>Je.fire({title:a.title||"Notification",text:a.text,html:a.html,icon:a.icon||"info",showConfirmButton:a.showConfirmButton??!0,showCancelButton:a.showCancelButton??!1,showDenyButton:a.showDenyButton??!1,confirmButtonText:a.confirmButtonText||"OK",cancelButtonText:a.cancelButtonText||"Cancel",denyButtonText:a.denyButtonText||"No",confirmButtonColor:a.confirmButtonColor||"#3085d6",cancelButtonColor:a.cancelButtonColor||"#d33",reverseButtons:a.reverseButtons??!0,timer:a.timer}).then(m=>{m.isConfirmed&&a.onConfirm&&a.onConfirm(),m.isDenied&&a.onDeny&&a.onDeny(),m.isDismissed&&a.onCancel&&a.onCancel()});return{showAlert:s,showConfirm:a=>s({...a,showCancelButton:!0,confirmButtonText:a.confirmButtonText||"Yes",cancelButtonText:a.cancelButtonText||"No",icon:a.icon||"question"}),showSuccess:(a,m)=>s({title:m||"Success",text:a,icon:"success"}),showError:(a,m)=>s({title:m||"Error",text:a,icon:"error"}),showWarning:(a,m)=>s({title:m||"Warning",text:a,icon:"warning"}),showInfo:(a,m)=>s({title:m||"Information",text:a,icon:"info"}),showLoading:a=>Je.fire({title:a||"Processing...",allowOutsideClick:!1,allowEscapeKey:!1,showConfirmButton:!1,didOpen:()=>{Je.showLoading()}}),closeLoading:()=>{Je.close()}}},Ln=()=>{c.useEffect(()=>{const e=window.page?.props?.flash;e&&s(e);const t=r=>{const o=r.detail.page.props.flash;o&&s(o)};return Jt.on("navigate",t),()=>{}},[]);const s=e=>{e?.success&&_.success(e.success),e?.error&&_.error(e.error),e?.warning&&_.warning(e.warning),e?.info&&_.info(e.info)}},St=[{id:"mobile_money",name:"Mobile Money",providers:["M-PESA","Airtel Money","Orange Money"]},{id:"card",name:"Bank Card",providers:["Visa","Mastercard"]},{id:"bank_transfer",name:"Bank Transfer",providers:["All Banks"]}],hs=s=>{const e=ft.c(178),{order:t,taxpayerInfo:r}=s,[o,l]=c.useState(t.payment_method||"mobile_money"),[i,d]=c.useState(t.payment_provider||""),[a,m]=c.useState(""),[x,u]=c.useState(!1),[f,h]=c.useState(!1),p=Mn();Ln();let y;e[0]!==a||e[1]!==o||e[2]!==i?(y={payment_method:o,payment_provider:i,phone_number:a},e[0]=a,e[1]=o,e[2]=i,e[3]=y):y=e[3];const{setData:g,processing:Ut,errors:be}=Zt(y),Ht=Gn;let ye;e[4]!==g?(ye=b=>{l(b),g("payment_method",b),d(""),b==="bank_transfer"&&_.info("Bank transfer requires downloading and presenting invoice at the bank")},e[4]=g,e[5]=ye):ye=e[5];const nt=ye;let ve;e[6]!==g?(ve=b=>{d(b),g("payment_provider",b)},e[6]=g,e[7]=ve):ve=e[7];const st=ve;let _e;e[8]!==g?(_e=b=>{m(b.target.value),g("phone_number",b.target.value)},e[8]=g,e[9]=_e):_e=e[9];const ot=_e;let j;if(e[10]!==t.grand_total||e[11]!==a||e[12]!==o||e[13]!==p){j=mt=>{if(mt.preventDefault(),o==="mobile_money"&&a&&!a.match(/^(\+243|0)[0-9]{9}$/)){p.showError("Please enter a valid phone number for mobile money");return}p.showConfirm({title:"Confirm Payment",html:`
                <div style="text-align: left;">
                    <p><strong>Amount:</strong> ${v(parseFloat(t.grand_total))}</p>
                    <p><strong>Method:</strong> ${o}</p>
                    ${o==="mobile_money"?`<p><strong>Phone:</strong> ${a}</p>`:""}
                </div>
            `,icon:"question",confirmButtonText:"Yes, Proceed to Payment",cancelButtonText:"Cancel",onConfirm:()=>{b()}})};const b=()=>{u(!0),_.info("Online payment coming soon!")};e[10]=t.grand_total,e[11]=a,e[12]=o,e[13]=p,e[14]=j}else j=e[14];let N,w;if(e[15]!==t.grand_total||e[16]!==t.order_number||e[17]!==t.packaging_type||e[18]!==t.penalty_amount||e[19]!==t.product?.name||e[20]!==t.quantity||e[21]!==t.stamp_type?.name||e[22]!==t.tax_amount||e[23]!==t.total_amount||e[24]!==t.unit_price||e[25]!==o||e[26]!==p||e[27]!==r){w=()=>{p.showConfirm({title:"Download Invoice",html:`
                <div style="text-align: left;">
                    <p>This invoice is for <strong>bank payment only</strong>.</p>
                    <p>After downloading:</p>
                    <ul style="margin-left: 20px;">
                        <li>Print the invoice</li>
                        <li>Present at any authorized bank</li>
                        <li>Make payment at the bank counter</li>
                        <li>Return with bank-stamped copy for approval</li>
                    </ul>
                </div>
            `,icon:"info",confirmButtonText:"Yes, Download Invoice",cancelButtonText:"Cancel",onConfirm:()=>{h(!0);const me=_.loading("Generating invoice...");mt(),setTimeout(()=>{h(!1),_.dismiss(me),_.success("Invoice generated successfully"),p.showInfo("Remember to present the printed invoice at the bank with your payment.","Next Steps")},1e3)}})};let b;e[30]!==t.order_number||e[31]!==p?(b=()=>{p.showConfirm({title:"Cancel Order",html:`
                <div style="text-align: left;">
                    <p>Are you sure you want to cancel order #${t.order_number}?</p>
                    <p style="color: #d33; font-weight: bold;">This action cannot be undone!</p>
                </div>
            `,icon:"warning",confirmButtonText:"Yes, Cancel Order",cancelButtonText:"No, Keep Order",confirmButtonColor:"#d33",onConfirm:zn})},e[30]=t.order_number,e[31]=p,e[32]=b):b=e[32],N=b;const mt=()=>{const me=window.open("","_blank");if(!me){_.error("Please allow pop-ups to download the invoice"),h(!1);return}const Yt=new Date().toLocaleDateString("en-US"),Wt=new Date(Date.now()+6048e5).toLocaleDateString("en-US"),Qt=Ht(r),Xt=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - Order #${t.order_number}</title>
                <meta charset="UTF-8">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Arial', sans-serif;
                        background: #fff;
                        color: #333;
                        line-height: 1.3;
                    }
                    .invoice {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 15px;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #0033a0;
                    }
                    .logo {
                        width: 80px;
                        height: 80px;
                        object-fit: contain;
                    }
                    .title-section {
                        flex: 1;
                    }
                    .title-section h1 {
                        color: #0033a0;
                        font-size: 20px;
                        margin-bottom: 3px;
                    }
                    .title-section h2 {
                        color: #ce1126;
                        font-size: 14px;
                        font-weight: normal;
                    }
                    .flag-colors {
                        display: flex;
                        gap: 3px;
                        margin-top: 5px;
                    }
                    .flag-blue { width: 25px; height: 6px; background: #0033a0; }
                    .flag-red { width: 25px; height: 6px; background: #ce1126; }
                    .flag-yellow { width: 25px; height: 6px; background: #f7d618; }
                    .status-badge {
                        background: #ffc107;
                        color: #333;
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: bold;
                        display: inline-block;
                    }
                    .reference-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #f5f5f5;
                        padding: 8px 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 13px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    .info-box {
                        background: #f9f9f9;
                        padding: 12px;
                        border-radius: 4px;
                        border-left: 3px solid #0033a0;
                    }
                    .info-box h3 {
                        font-size: 14px;
                        margin-bottom: 8px;
                        color: #0033a0;
                    }
                    .info-row {
                        display: flex;
                        margin-bottom: 4px;
                        font-size: 12px;
                    }
                    .info-label {
                        width: 90px;
                        color: #666;
                    }
                    .info-value {
                        flex: 1;
                        font-weight: 500;
                    }
                    .order-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                        font-size: 12px;
                    }
                    .order-table th {
                        background: #0033a0;
                        color: white;
                        padding: 8px;
                        text-align: left;
                        font-weight: 500;
                    }
                    .order-table td {
                        padding: 8px;
                        border-bottom: 1px solid #ddd;
                    }
                    .order-table tr:last-child {
                        background: #f0f0f0;
                        font-weight: bold;
                    }
                    .amount-due {
                        background: #e6f0ff;
                        padding: 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .amount-due .label {
                        font-weight: bold;
                        color: #ce1126;
                    }
                    .amount-due .value {
                        font-size: 22px;
                        font-weight: bold;
                        color: #0033a0;
                    }
                    .bank-details {
                        background: #fff3cd;
                        padding: 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 12px;
                    }
                    .bank-details h3 {
                        font-size: 13px;
                        margin-bottom: 8px;
                        color: #856404;
                    }
                    .bank-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }
                    .bank-item {
                        display: flex;
                    }
                    .bank-item .label {
                        width: 80px;
                        color: #666;
                    }
                    .instructions {
                        background: #f5f5f5;
                        padding: 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 11px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 8px;
                    }
                    .print-button {
                        display: block;
                        width: 100%;
                        padding: 10px;
                        background: #0033a0;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        cursor: pointer;
                        margin: 10px 0;
                    }
                    @media print {
                        .print-button { display: none; }
                        body { background: white; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <img src="/KBS_logo.png" alt="ISS Logo" class="logo" onerror="this.style.display='none'">
                        <div class="title-section">
                            <h1>KINSHASA INTEGRATED STAMPING AUTHORITY</h1>
                            <h2>DEMOCRATIC REPUBLIC OF CONGO</h2>
                            <div class="flag-colors">
                                <div class="flag-blue"></div>
                                <div class="flag-red"></div>
                                <div class="flag-yellow"></div>
                            </div>
                        </div>
                    </div>

                    <div class="reference-row">
                        <div>
                            <strong>Invoice:</strong> INV-${t.order_number} | 
                            <strong>Order:</strong> ${t.order_number} | 
                            <strong>Date:</strong> ${Yt} | 
                            <strong>Due:</strong> ${Wt}
                        </div>
                        <span class="status-badge">PENDING PAYMENT</span>
                    </div>

                    <div class="info-grid">
                        <div class="info-box">
                            <h3>TAXPAYER DETAILS</h3>
                            <div class="info-row">
                                <span class="info-label">Company:</span>
                                <span class="info-value">${r.company_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">TIN:</span>
                                <span class="info-value">${r.tax_identification_number}</span>
                            </div>
                            ${r.trade_register_number?`
                            <div class="info-row">
                                <span class="info-label">RCCM:</span>
                                <span class="info-value">${r.trade_register_number}</span>
                            </div>
                            `:""}
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span class="info-value">${Qt}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">${r.phone_number}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${r.email}</span>
                            </div>
                        </div>

                        <div class="info-box">
                            <h3>AUTHORITY DETAILS</h3>
                            <div class="info-row">
                                <span class="info-label">Dept:</span>
                                <span class="info-value">Directorate of Stamps</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span class="info-value">30 June Blvd, Gombe</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">+243 81 555 1234</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">stamps@finance.gouv.cd</span>
                            </div>
                        </div>
                    </div>

                    <table class="order-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>${t.product?.name||"Stamp Duty"}</strong><br>
                                    <span style="font-size: 11px; color: #666;">
                                        Type: ${t.stamp_type?.name||"Standard"} | Pkg: ${t.packaging_type}
                                    </span>
                                </td>
                                <td>${t.quantity.toLocaleString()}</td>
                                <td>${v(parseFloat(t.unit_price))}</td>
                                <td>${v(parseFloat(t.total_amount))}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                                <td>${v(parseFloat(t.total_amount))}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>VAT (16%):</strong></td>
                                <td>${v(parseFloat(t.tax_amount))}</td>
                            </tr>
                            ${parseFloat(t.penalty_amount)>0?`
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Penalties:</strong></td>
                                <td>${v(parseFloat(t.penalty_amount))}</td>
                            </tr>
                            `:""}
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
                                <td style="color: #ce1126;">${v(parseFloat(t.grand_total))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="amount-due">
                        <span class="label">AMOUNT DUE:</span>
                        <span class="value">${v(parseFloat(t.grand_total))}</span>
                    </div>

                    <div style="font-family: monospace; background: #fff; padding: 6px 10px; border: 1px dashed #0033a0; margin-bottom: 15px; font-size: 12px; text-align: center;">
                        <strong>PAYMENT REF:</strong> ${t.order_number}-${r.tax_identification_number}
                    </div>

                    ${o==="bank_transfer"?`
                    <div class="bank-details">
                        <h3>🏦 BANK TRANSFER DETAILS</h3>
                        <div class="bank-grid">
                            <div class="bank-item">
                                <span class="label">Bank:</span>
                                <span><strong>Central Bank of Congo</strong></span>
                            </div>
                            <div class="bank-item">
                                <span class="label">Account:</span>
                                <span><strong>Kinshasa Stamping Authority</strong></span>
                            </div>
                            <div class="bank-item">
                                <span class="label">Acc Number:</span>
                                <span><strong>12345-67890-123456789-01</strong></span>
                            </div>
                            <div class="bank-item">
                                <span class="label">SWIFT:</span>
                                <span><strong>BCCUCDKI</strong></span>
                            </div>
                        </div>
                    </div>
                    `:""}

                    <div class="instructions">
                        <p><strong>📋 INSTRUCTIONS:</strong></p>
                        <p>1. Present this invoice at any authorized bank for payment</p>
                        <p>2. After payment, bring bank-stamped copy + required documents for approval</p>
                        <p>3. Valid for 7 days | For online payments, use portal</p>
                    </div>

                    <div class="footer">
                        <p>System-generated invoice - No signature required | Kinshasa, DRC | ${new Date().toLocaleString()}</p>
                    </div>

                    <button class="print-button" onclick="window.print()">🖨️ Print Invoice</button>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 500);
                    }
                <\/script>
            </body>
            </html>
        `;me.document.write(Xt),me.document.close()};e[15]=t.grand_total,e[16]=t.order_number,e[17]=t.packaging_type,e[18]=t.penalty_amount,e[19]=t.product?.name,e[20]=t.quantity,e[21]=t.stamp_type?.name,e[22]=t.tax_amount,e[23]=t.total_amount,e[24]=t.unit_price,e[25]=o,e[26]=p,e[27]=r,e[28]=N,e[29]=w}else N=e[28],w=e[29];const Kt=qn;let we;e[33]===Symbol.for("react.memo_cache_sentinel")?(we=n.jsx(en,{title:"Checkout - Stamp Order"}),e[33]=we):we=e[33];let je;e[34]===Symbol.for("react.memo_cache_sentinel")?(je=n.jsx(bt,{href:"taxpayer/orders?view=history",className:"text-sm text-muted-foreground hover:text-primary",children:"← Back to Orders"}),e[34]=je):je=e[34];let C;e[35]!==N||e[36]!==t.status?(C=t.status==="payment_pending"&&n.jsx(pe,{variant:"destructive",size:"sm",onClick:N,children:"Cancel Order"}),e[35]=N,e[36]=t.status,e[37]=C):C=e[37];let S;e[38]!==C?(S=n.jsxs("div",{className:"mb-6 flex justify-between items-center",children:[je,C]}),e[38]=C,e[39]=S):S=e[39];let Ne;e[40]===Symbol.for("react.memo_cache_sentinel")?(Ne=n.jsx(ue,{className:"text-2xl",children:"Complete Payment"}),e[40]=Ne):Ne=e[40];let k;e[41]!==t.order_number?(k=n.jsxs("div",{children:[Ne,n.jsxs(ln,{children:["Order #",t.order_number]})]}),e[41]=t.order_number,e[42]=k):k=e[42];let R;e[43]!==t.status?(R=Kt(t.status),e[43]=t.status,e[44]=R):R=e[44];let P;e[45]!==k||e[46]!==R?(P=n.jsx(fe,{children:n.jsxs("div",{className:"flex justify-between items-start",children:[k,R]})}),e[45]=k,e[46]=R,e[47]=P):P=e[47];let Ce;e[48]===Symbol.for("react.memo_cache_sentinel")?(Ce=n.jsx("h3",{className:"font-semibold mb-3",children:"Order Details"}),e[48]=Ce):Ce=e[48];let Se;e[49]===Symbol.for("react.memo_cache_sentinel")?(Se=n.jsx("p",{className:"text-muted-foreground",children:"Quantity"}),e[49]=Se):Se=e[49];let I;e[50]!==t.quantity?(I=t.quantity.toLocaleString(),e[50]=t.quantity,e[51]=I):I=e[51];let A;e[52]!==I?(A=n.jsxs("div",{children:[Se,n.jsxs("p",{className:"font-medium",children:[I," stamps"]})]}),e[52]=I,e[53]=A):A=e[53];let ke;e[54]===Symbol.for("react.memo_cache_sentinel")?(ke=n.jsx("p",{className:"text-muted-foreground",children:"Packaging"}),e[54]=ke):ke=e[54];let D;e[55]!==t.packaging_type?(D=n.jsxs("div",{children:[ke,n.jsx("p",{className:"font-medium capitalize",children:t.packaging_type})]}),e[55]=t.packaging_type,e[56]=D):D=e[56];let Re;e[57]===Symbol.for("react.memo_cache_sentinel")?(Re=n.jsx("p",{className:"text-muted-foreground",children:"Delivery Method"}),e[57]=Re):Re=e[57];let T;e[58]!==t.delivery_method?(T=n.jsxs("div",{children:[Re,n.jsx("p",{className:"font-medium capitalize",children:t.delivery_method})]}),e[58]=t.delivery_method,e[59]=T):T=e[59];let Pe;e[60]===Symbol.for("react.memo_cache_sentinel")?(Pe=n.jsx("p",{className:"text-muted-foreground",children:"Order Date"}),e[60]=Pe):Pe=e[60];let E;e[61]!==t.created_at?(E=yt(t.created_at),e[61]=t.created_at,e[62]=E):E=e[62];let B;e[63]!==E?(B=n.jsxs("div",{children:[Pe,n.jsx("p",{className:"font-medium",children:E})]}),e[63]=E,e[64]=B):B=e[64];let $;e[65]!==A||e[66]!==D||e[67]!==T||e[68]!==B?($=n.jsxs("div",{className:"bg-muted/50 p-4 rounded-lg",children:[Ce,n.jsxs("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[A,D,T,B]})]}),e[65]=A,e[66]=D,e[67]=T,e[68]=B,e[69]=$):$=e[69];let Ie;e[70]===Symbol.for("react.memo_cache_sentinel")?(Ie=n.jsx("h3",{className:"font-semibold",children:"Select Payment Method"}),e[70]=Ie):Ie=e[70];let Ae;e[71]===Symbol.for("react.memo_cache_sentinel")?(Ae=St.map(Vn),e[71]=Ae):Ae=e[71];let O;e[72]!==nt||e[73]!==o?(O=n.jsx(ut,{value:o,onValueChange:nt,children:Ae}),e[72]=nt,e[73]=o,e[74]=O):O=e[74];let F;e[75]!==be||e[76]!==ot||e[77]!==st||e[78]!==a||e[79]!==o||e[80]!==i?(F=o==="mobile_money"&&n.jsxs("div",{className:"mt-4 space-y-4",children:[n.jsxs("div",{children:[n.jsx(Ze,{htmlFor:"provider",children:"Select Provider"}),n.jsx(ut,{value:i,onValueChange:st,className:"flex flex-wrap gap-4 mt-2",children:St.find(Un)?.providers.map(Hn)})]}),n.jsxs("div",{children:[n.jsx(Ze,{htmlFor:"phone",children:"Phone Number"}),n.jsx(hn,{id:"phone",type:"tel",placeholder:"Enter your phone number",value:a,onChange:ot,required:o==="mobile_money"}),be.phone_number&&n.jsx("p",{className:"text-sm text-red-500 mt-1",children:be.phone_number})]})]}),e[75]=be,e[76]=ot,e[77]=st,e[78]=a,e[79]=o,e[80]=i,e[81]=F):F=e[81];let M;e[82]!==o?(M=o==="card"&&n.jsxs(vt,{className:"mt-4",children:[n.jsx(Pt,{className:"h-4 w-4"}),n.jsx(_t,{children:"Card Payment"}),n.jsx(wt,{children:"You will be redirected to a secure payment page to enter your card details."})]}),e[82]=o,e[83]=M):M=e[83];let L;e[84]!==o?(L=o==="bank_transfer"&&n.jsxs(vt,{className:"mt-4",children:[n.jsx(xn,{className:"h-4 w-4"}),n.jsx(_t,{children:"Bank Transfer"}),n.jsx(wt,{children:"Download the invoice and present it at any authorized bank to make payment. After payment, present the bank-stamped invoice at our offices for validation."})]}),e[84]=o,e[85]=L):L=e[85];let G;e[86]!==O||e[87]!==F||e[88]!==M||e[89]!==L?(G=n.jsxs("div",{className:"space-y-4",children:[Ie,O,F,M,L]}),e[86]=O,e[87]=F,e[88]=M,e[89]=L,e[90]=G):G=e[90];let De;e[91]===Symbol.for("react.memo_cache_sentinel")?(De=n.jsx(jt,{className:"my-6"}),e[91]=De):De=e[91];let Te;e[92]===Symbol.for("react.memo_cache_sentinel")?(Te=n.jsx("span",{className:"text-muted-foreground",children:"Subtotal"}),e[92]=Te):Te=e[92];const at=parseFloat(t.total_amount);let z;e[93]!==at?(z=v(at),e[93]=at,e[94]=z):z=e[94];let q;e[95]!==z?(q=n.jsxs("div",{className:"flex justify-between text-sm",children:[Te,n.jsx("span",{children:z})]}),e[95]=z,e[96]=q):q=e[96];let Ee;e[97]===Symbol.for("react.memo_cache_sentinel")?(Ee=n.jsx("span",{className:"text-muted-foreground",children:"VAT (16%)"}),e[97]=Ee):Ee=e[97];const rt=parseFloat(t.tax_amount);let V;e[98]!==rt?(V=v(rt),e[98]=rt,e[99]=V):V=e[99];let U;e[100]!==V?(U=n.jsxs("div",{className:"flex justify-between text-sm",children:[Ee,n.jsx("span",{children:V})]}),e[100]=V,e[101]=U):U=e[101];let H;e[102]!==t.penalty_amount?(H=parseFloat(t.penalty_amount)>0&&n.jsxs("div",{className:"flex justify-between text-sm",children:[n.jsx("span",{className:"text-muted-foreground",children:"Penalties"}),n.jsx("span",{className:"text-red-600",children:v(parseFloat(t.penalty_amount))})]}),e[102]=t.penalty_amount,e[103]=H):H=e[103];let Be;e[104]===Symbol.for("react.memo_cache_sentinel")?(Be=n.jsx(jt,{className:"my-2"}),e[104]=Be):Be=e[104];let $e;e[105]===Symbol.for("react.memo_cache_sentinel")?($e=n.jsx("span",{children:"Total"}),e[105]=$e):$e=e[105];const it=parseFloat(t.grand_total);let K;e[106]!==it?(K=v(it),e[106]=it,e[107]=K):K=e[107];let Y;e[108]!==K?(Y=n.jsxs("div",{className:"flex justify-between font-semibold text-lg",children:[$e,n.jsx("span",{children:K})]}),e[108]=K,e[109]=Y):Y=e[109];let W;e[110]!==q||e[111]!==U||e[112]!==H||e[113]!==Y?(W=n.jsxs("div",{className:"space-y-2",children:[q,U,H,Be,Y]}),e[110]=q,e[111]=U,e[112]=H,e[113]=Y,e[114]=W):W=e[114];let Oe;e[115]===Symbol.for("react.memo_cache_sentinel")?(Oe=n.jsx(Ct,{className:"h-4 w-4"}),e[115]=Oe):Oe=e[115];const lt=f?"Generating...":"Download Invoice for Bank Payment";let Q;e[116]!==w||e[117]!==f||e[118]!==lt?(Q=n.jsxs(pe,{type:"button",variant:"outline",className:"w-full flex items-center justify-center gap-2",onClick:w,disabled:f,children:[Oe,lt]}),e[116]=w,e[117]=f,e[118]=lt,e[119]=Q):Q=e[119];const ct=Ut||x||o==="mobile_money"&&(!i||!a);let X;e[120]!==x||e[121]!==t.grand_total?(X=x?"Processing...":`Pay Online ${v(parseFloat(t.grand_total))}`,e[120]=x,e[121]=t.grand_total,e[122]=X):X=e[122];let J;e[123]!==ct||e[124]!==X?(J=n.jsx(pe,{type:"submit",className:"w-full",disabled:ct,children:X}),e[123]=ct,e[124]=X,e[125]=J):J=e[125];let Z;e[126]!==Q||e[127]!==J?(Z=n.jsxs("div",{className:"mt-6 space-y-3",children:[Q,J]}),e[126]=Q,e[127]=J,e[128]=Z):Z=e[128];let ee;e[129]!==j||e[130]!==G||e[131]!==W||e[132]!==Z?(ee=n.jsxs("form",{onSubmit:j,children:[G,De,W,Z]}),e[129]=j,e[130]=G,e[131]=W,e[132]=Z,e[133]=ee):ee=e[133];let te;e[134]!==$||e[135]!==ee?(te=n.jsx(he,{children:n.jsxs("div",{className:"space-y-6",children:[$,ee]})}),e[134]=$,e[135]=ee,e[136]=te):te=e[136];let ne;e[137]!==P||e[138]!==te?(ne=n.jsx("div",{className:"lg:col-span-2",children:n.jsxs(xe,{children:[P,te]})}),e[137]=P,e[138]=te,e[139]=ne):ne=e[139];let Fe;e[140]===Symbol.for("react.memo_cache_sentinel")?(Fe=n.jsx(fe,{className:"pb-2",children:n.jsxs(ue,{className:"text-lg flex items-center gap-2 text-blue-700",children:[n.jsx(on,{className:"h-5 w-5"}),"Bank Payment Option"]})}),e[140]=Fe):Fe=e[140];let Me;e[141]===Symbol.for("react.memo_cache_sentinel")?(Me=n.jsx("p",{className:"text-sm text-blue-800 mb-3",children:"Prefer to pay at the bank? Download the invoice and present it at any authorized bank branch."}),e[141]=Me):Me=e[141];let Le;e[142]===Symbol.for("react.memo_cache_sentinel")?(Le=n.jsx(Ct,{className:"h-4 w-4"}),e[142]=Le):Le=e[142];const dt=f?"Generating...":"Download Invoice";let se;e[143]!==w||e[144]!==f||e[145]!==dt?(se=n.jsxs(pe,{variant:"default",className:"w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2",onClick:w,disabled:f,children:[Le,dt]}),e[143]=w,e[144]=f,e[145]=dt,e[146]=se):se=e[146];let Ge;e[147]===Symbol.for("react.memo_cache_sentinel")?(Ge=n.jsx("div",{className:"mt-3 text-xs text-blue-600",children:n.jsx("p",{children:"After bank payment, present the stamped invoice at the authority with required documents for approval."})}),e[147]=Ge):Ge=e[147];let oe;e[148]!==se?(oe=n.jsxs(xe,{className:"border-2 border-blue-200 bg-blue-50",children:[Fe,n.jsxs(he,{children:[Me,se,Ge]})]}),e[148]=se,e[149]=oe):oe=e[149];let ze;e[150]===Symbol.for("react.memo_cache_sentinel")?(ze=n.jsx(fe,{children:n.jsxs(ue,{className:"text-lg flex items-center gap-2",children:[n.jsx(gn,{className:"h-5 w-5"}),"Delivery Information"]})}),e[150]=ze):ze=e[150];let qe;e[151]===Symbol.for("react.memo_cache_sentinel")?(qe=n.jsx("span",{className:"text-muted-foreground",children:"Method:"}),e[151]=qe):qe=e[151];let ae;e[152]!==t.delivery_method?(ae=n.jsxs("p",{children:[qe," ",n.jsx("span",{className:"font-medium capitalize",children:t.delivery_method})]}),e[152]=t.delivery_method,e[153]=ae):ae=e[153];let re;e[154]!==t.delivery_address?(re=t.delivery_address&&n.jsxs("p",{children:[n.jsx("span",{className:"text-muted-foreground",children:"Address:"})," ",n.jsx("span",{className:"font-medium",children:t.delivery_address})]}),e[154]=t.delivery_address,e[155]=re):re=e[155];let ie;e[156]!==t.estimated_delivery_date?(ie=t.estimated_delivery_date&&n.jsxs("p",{children:[n.jsx("span",{className:"text-muted-foreground",children:"Estimated Delivery:"})," ",n.jsx("span",{className:"font-medium",children:yt(t.estimated_delivery_date)})]}),e[156]=t.estimated_delivery_date,e[157]=ie):ie=e[157];let le;e[158]!==ae||e[159]!==re||e[160]!==ie?(le=n.jsxs(xe,{children:[ze,n.jsx(he,{children:n.jsxs("div",{className:"space-y-2 text-sm",children:[ae,re,ie]})})]}),e[158]=ae,e[159]=re,e[160]=ie,e[161]=le):le=e[161];let Ve;e[162]===Symbol.for("react.memo_cache_sentinel")?(Ve=n.jsx(fe,{children:n.jsxs(ue,{className:"text-lg flex items-center gap-2",children:[n.jsx(bn,{className:"h-5 w-5"}),"Required Documents"]})}),e[162]=Ve):Ve=e[162];let Ue;e[163]===Symbol.for("react.memo_cache_sentinel")?(Ue=n.jsxs("li",{className:"flex items-center gap-2",children:[n.jsx(ge,{className:"h-4 w-4 text-green-500"}),"Import Declaration (if applicable)"]}),e[163]=Ue):Ue=e[163];let He;e[164]===Symbol.for("react.memo_cache_sentinel")?(He=n.jsxs("li",{className:"flex items-center gap-2",children:[n.jsx(ge,{className:"h-4 w-4 text-green-500"}),"Marketing Authorization (if applicable)"]}),e[164]=He):He=e[164];let Ke;e[165]===Symbol.for("react.memo_cache_sentinel")?(Ke=n.jsxs(xe,{children:[Ve,n.jsx(he,{children:n.jsxs("ul",{className:"space-y-2 text-sm",children:[Ue,He,n.jsxs("li",{className:"flex items-center gap-2",children:[n.jsx(ge,{className:"h-4 w-4 text-green-500"}),"Certificate of Conformity (if applicable)"]})]})})]}),e[165]=Ke):Ke=e[165];let Ye;e[166]===Symbol.for("react.memo_cache_sentinel")?(Ye=n.jsx(fe,{children:n.jsx(ue,{className:"text-lg",children:"Need Help?"})}),e[166]=Ye):Ye=e[166];let We;e[167]===Symbol.for("react.memo_cache_sentinel")?(We=n.jsx("p",{className:"text-sm text-muted-foreground mb-3",children:"If you encounter any payment issues or need assistance, please contact our support."}),e[167]=We):We=e[167];let Qe;e[168]===Symbol.for("react.memo_cache_sentinel")?(Qe=n.jsxs(xe,{children:[Ye,n.jsxs(he,{children:[We,n.jsx(pe,{variant:"outline",className:"w-full",asChild:!0,children:n.jsx(bt,{href:"/help",children:"Contact Support"})})]})]}),e[168]=Qe):Qe=e[168];let ce;e[169]!==oe||e[170]!==le?(ce=n.jsx("div",{className:"lg:col-span-1",children:n.jsxs("div",{className:"space-y-4",children:[oe,le,Ke,Qe]})}),e[169]=oe,e[170]=le,e[171]=ce):ce=e[171];let de;e[172]!==ne||e[173]!==ce?(de=n.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[ne,ce]}),e[172]=ne,e[173]=ce,e[174]=de):de=e[174];let Xe;return e[175]!==de||e[176]!==S?(Xe=n.jsxs(an,{children:[we,n.jsxs("div",{className:"container mx-auto py-8 px-4 max-w-6xl",children:[S,de]})]}),e[175]=de,e[176]=S,e[177]=Xe):Xe=e[177],Xe};function Gn(s){return[s.physical_address,s.avenue,s.number?`No. ${s.number}`:null,s.plot_number?`Plot ${s.plot_number}`:null].filter(Boolean).join(", ")||"Address not provided"}function zn(){_.info("Order cancelling coming soon...")}function qn(s){const e={payment_pending:{color:"bg-yellow-100 text-yellow-800",icon:Nt,label:"Payment Pending"},paid:{color:"bg-green-100 text-green-800",icon:ge,label:"Paid"},processing:{color:"bg-blue-100 text-blue-800",icon:Nt,label:"Processing"},completed:{color:"bg-green-100 text-green-800",icon:ge,label:"Completed"},cancelled:{color:"bg-red-100 text-red-800",icon:Pt,label:"Cancelled"}},t=e[s]||e.payment_pending,r=t.icon;return n.jsxs(cn,{className:`${t.color} flex items-center gap-1`,children:[n.jsx(r,{className:"h-3 w-3"}),t.label]})}function Vn(s){return n.jsxs("div",{className:"flex items-start space-x-3 space-y-0",children:[n.jsx(gt,{value:s.id,id:s.id}),n.jsx(Ze,{htmlFor:s.id,className:"font-medium cursor-pointer",children:s.name})]},s.id)}function Un(s){return s.id==="mobile_money"}function Hn(s){return n.jsxs("div",{className:"flex items-center space-x-2",children:[n.jsx(gt,{value:s,id:s}),n.jsx(Ze,{htmlFor:s,children:s})]},s)}export{hs as default};
