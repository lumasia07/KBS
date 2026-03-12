import{r as d,j as s,c as ms,b as Ys,t as w,u as Xs,H as Js,L as gs}from"./app-BVaPLXVO.js";import{d as Ss,I as Qs,R as Zs,c as en,b as tn,A as sn}from"./app-layout-Cjhd4oQE.js";import{c as nn,u as fs,a as Rs,B as It,b as ys,f as v}from"./button-lIang9PO.js";import{d as an,C as Tt,a as At,b as Dt,c as Et}from"./card-DIANv8Z3.js";import{S as bs}from"./separator-B1--Zapp.js";import{B as on}from"./badge-DwmwPAg2.js";import{c as ps,d as rn,u as ln,a as cn}from"./Combination-DPL2L4Mx.js";import{u as dn}from"./index-CR6wuylE.js";import{c as pn}from"./createLucideIcon-DDuW2XNH.js";import{L as Zt}from"./label-NNEW8Bac.js";import{I as un}from"./input-BwwAOTrz.js";import{b as vs,a as ws,A as js}from"./alert-Yvfg3wL6.js";import{S as Qt}from"./sweetalert2.esm.all-YZDMVk0e.js";import{u as mn}from"./useI18nStore-708AryBj.js";import{C as _s}from"./circle-alert-BM9Rg09d.js";import{L as fn}from"./landmark-DC0QNA3O.js";import{C as Bt}from"./circle-check-big-B_X1lPoc.js";import{C as ks}from"./clock-1fYFyYjE.js";import{D as Ns}from"./download-CNhjNGz9.js";import{T as xn}from"./truck-CeOAH-gH.js";import{F as hn}from"./x-BSHLVKgG.js";/* empty css            */import"./index-DsMaMeIy.js";import"./index-EBLA1b0H.js";import"./credit-card-Ctd4M2S0.js";const gn=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],yn=pn("circle",gn);function Ps(o,e=[]){let t=[];function l(c,i){const p=d.createContext(i),r=t.length;t=[...t,i];const u=h=>{const{scope:f,children:g,...m}=h,n=f?.[o]?.[r]||p,b=d.useMemo(()=>m,Object.values(m));return s.jsx(n.Provider,{value:b,children:g})};u.displayName=c+"Provider";function y(h,f){const g=f?.[o]?.[r]||p,m=d.useContext(g);if(m)return m;if(i!==void 0)return i;throw new Error(`\`${h}\` must be used within \`${c}\``)}return[u,y]}const a=()=>{const c=t.map(i=>d.createContext(i));return function(p){const r=p?.[o]||c;return d.useMemo(()=>({[`__scope${o}`]:{...p,[o]:r}}),[p,r])}};return a.scopeName=o,[l,bn(a,...e)]}function bn(...o){const e=o[0];if(o.length===1)return e;const t=()=>{const l=o.map(a=>({useScope:a(),scopeName:a.scopeName}));return function(c){const i=l.reduce((p,{useScope:r,scopeName:u})=>{const h=r(c)[`__scope${u}`];return{...p,...h}},{});return d.useMemo(()=>({[`__scope${e.scopeName}`]:i}),[i])}};return t.scopeName=e.scopeName,t}function vn(o){const e=wn(o),t=d.forwardRef((l,a)=>{const{children:c,...i}=l,p=d.Children.toArray(c),r=p.find(_n);if(r){const u=r.props.children,y=p.map(h=>h===r?d.Children.count(u)>1?d.Children.only(null):d.isValidElement(u)?u.props.children:null:h);return s.jsx(e,{...i,ref:a,children:d.isValidElement(u)?d.cloneElement(u,void 0,y):null})}return s.jsx(e,{...i,ref:a,children:c})});return t.displayName=`${o}.Slot`,t}function wn(o){const e=d.forwardRef((t,l)=>{const{children:a,...c}=t;if(d.isValidElement(a)){const i=Nn(a),p=kn(c,a.props);return a.type!==d.Fragment&&(p.ref=l?nn(l,i):i),d.cloneElement(a,p)}return d.Children.count(a)>1?d.Children.only(null):null});return e.displayName=`${o}.SlotClone`,e}var jn=Symbol("radix.slottable");function _n(o){return d.isValidElement(o)&&typeof o.type=="function"&&"__radixId"in o.type&&o.type.__radixId===jn}function kn(o,e){const t={...e};for(const l in e){const a=o[l],c=e[l];/^on[A-Z]/.test(l)?a&&c?t[l]=(...p)=>{const r=c(...p);return a(...p),r}:a&&(t[l]=a):l==="style"?t[l]={...a,...c}:l==="className"&&(t[l]=[a,c].filter(Boolean).join(" "))}return{...o,...t}}function Nn(o){let e=Object.getOwnPropertyDescriptor(o.props,"ref")?.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?o.ref:(e=Object.getOwnPropertyDescriptor(o,"ref")?.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?o.props.ref:o.props.ref||o.ref)}var Cn=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],es=Cn.reduce((o,e)=>{const t=vn(`Primitive.${e}`),l=d.forwardRef((a,c)=>{const{asChild:i,...p}=a,r=i?t:e;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),s.jsx(r,{...p,ref:c})});return l.displayName=`Primitive.${e}`,{...o,[e]:l}},{}),xs="Radio",[Sn,Is]=Ps(xs),[Rn,Pn]=Sn(xs),Ts=d.forwardRef((o,e)=>{const{__scopeRadio:t,name:l,checked:a=!1,required:c,disabled:i,value:p="on",onCheck:r,form:u,...y}=o,[h,f]=d.useState(null),g=fs(e,b=>f(b)),m=d.useRef(!1),n=h?u||!!h.closest("form"):!0;return s.jsxs(Rn,{scope:t,checked:a,disabled:i,children:[s.jsx(es.button,{type:"button",role:"radio","aria-checked":a,"data-state":Bs(a),"data-disabled":i?"":void 0,disabled:i,value:p,...y,ref:g,onClick:ps(o.onClick,b=>{a||r?.(),n&&(m.current=b.isPropagationStopped(),m.current||b.stopPropagation())})}),n&&s.jsx(Es,{control:h,bubbles:!m.current,name:l,value:p,checked:a,required:c,disabled:i,form:u,style:{transform:"translateX(-100%)"}})]})});Ts.displayName=xs;var As="RadioIndicator",Ds=d.forwardRef((o,e)=>{const{__scopeRadio:t,forceMount:l,...a}=o,c=Pn(As,t);return s.jsx(en,{present:l||c.checked,children:s.jsx(es.span,{"data-state":Bs(c.checked),"data-disabled":c.disabled?"":void 0,...a,ref:e})})});Ds.displayName=As;var In="RadioBubbleInput",Es=d.forwardRef(({__scopeRadio:o,control:e,checked:t,bubbles:l=!0,...a},c)=>{const i=d.useRef(null),p=fs(i,c),r=dn(t),u=cn(e);return d.useEffect(()=>{const y=i.current;if(!y)return;const h=window.HTMLInputElement.prototype,g=Object.getOwnPropertyDescriptor(h,"checked").set;if(r!==t&&g){const m=new Event("click",{bubbles:l});g.call(y,t),y.dispatchEvent(m)}},[r,t,l]),s.jsx(es.input,{type:"radio","aria-hidden":!0,defaultChecked:t,...a,tabIndex:-1,ref:p,style:{...a.style,...u,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});Es.displayName=In;function Bs(o){return o?"checked":"unchecked"}var Tn=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],ts="RadioGroup",[An]=Ps(ts,[Ss,Is]),$s=Ss(),Os=Is(),[Dn,En]=An(ts),Fs=d.forwardRef((o,e)=>{const{__scopeRadioGroup:t,name:l,defaultValue:a,value:c,required:i=!1,disabled:p=!1,orientation:r,dir:u,loop:y=!0,onValueChange:h,...f}=o,g=$s(t),m=rn(u),[n,b]=ln({prop:c,defaultProp:a??null,onChange:h,caller:ts});return s.jsx(Dn,{scope:t,name:l,required:i,disabled:p,value:n,onValueChange:b,children:s.jsx(Zs,{asChild:!0,...g,orientation:r,dir:m,loop:y,children:s.jsx(es.div,{role:"radiogroup","aria-required":i,"aria-orientation":r,"data-disabled":p?"":void 0,dir:m,...f,ref:e})})})});Fs.displayName=ts;var Ms="RadioGroupItem",Ls=d.forwardRef((o,e)=>{const{__scopeRadioGroup:t,disabled:l,...a}=o,c=En(Ms,t),i=c.disabled||l,p=$s(t),r=Os(t),u=d.useRef(null),y=fs(e,u),h=c.value===a.value,f=d.useRef(!1);return d.useEffect(()=>{const g=n=>{Tn.includes(n.key)&&(f.current=!0)},m=()=>f.current=!1;return document.addEventListener("keydown",g),document.addEventListener("keyup",m),()=>{document.removeEventListener("keydown",g),document.removeEventListener("keyup",m)}},[]),s.jsx(Qs,{asChild:!0,...p,focusable:!i,active:h,children:s.jsx(Ts,{disabled:i,required:c.required,checked:h,...r,...a,name:c.name,ref:y,onCheck:()=>c.onValueChange(a.value),onKeyDown:ps(g=>{g.key==="Enter"&&g.preventDefault()}),onFocus:ps(a.onFocus,()=>{f.current&&u.current?.click()})})})});Ls.displayName=Ms;var Bn="RadioGroupIndicator",Gs=d.forwardRef((o,e)=>{const{__scopeRadioGroup:t,...l}=o,a=Os(t);return s.jsx(Ds,{...a,...l,ref:e})});Gs.displayName=Bn;var zs=Fs,qs=Ls,$n=Gs;const us=d.forwardRef((o,e)=>{const t=ms.c(9);let l,a;t[0]!==o?({className:l,...a}=o,t[0]=o,t[1]=l,t[2]=a):(l=t[1],a=t[2]);let c;t[3]!==l?(c=Rs("grid gap-2",l),t[3]=l,t[4]=c):c=t[4];let i;return t[5]!==a||t[6]!==e||t[7]!==c?(i=s.jsx(zs,{className:c,...a,ref:e}),t[5]=a,t[6]=e,t[7]=c,t[8]=i):i=t[8],i});us.displayName=zs.displayName;const hs=d.forwardRef((o,e)=>{const t=ms.c(10);let l,a;t[0]!==o?({className:l,...a}=o,t[0]=o,t[1]=l,t[2]=a):(l=t[1],a=t[2]);let c;t[3]!==l?(c=Rs("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",l),t[3]=l,t[4]=c):c=t[4];let i;t[5]===Symbol.for("react.memo_cache_sentinel")?(i=s.jsx($n,{className:"flex items-center justify-center",children:s.jsx(yn,{className:"h-2.5 w-2.5 fill-current text-current"})}),t[5]=i):i=t[5];let p;return t[6]!==a||t[7]!==e||t[8]!==c?(p=s.jsx(qs,{ref:e,className:c,...a,children:i}),t[6]=a,t[7]=e,t[8]=c,t[9]=p):p=t[9],p});hs.displayName=qs.displayName;const On=()=>{const o=r=>Qt.fire({title:r.title||"Notification",text:r.text,html:r.html,icon:r.icon||"info",showConfirmButton:r.showConfirmButton??!0,showCancelButton:r.showCancelButton??!1,showDenyButton:r.showDenyButton??!1,confirmButtonText:r.confirmButtonText||"OK",cancelButtonText:r.cancelButtonText||"Cancel",denyButtonText:r.denyButtonText||"No",confirmButtonColor:r.confirmButtonColor||"#3085d6",cancelButtonColor:r.cancelButtonColor||"#d33",reverseButtons:r.reverseButtons??!0,timer:r.timer}).then(u=>{u.isConfirmed&&r.onConfirm&&r.onConfirm(),u.isDenied&&r.onDeny&&r.onDeny(),u.isDismissed&&r.onCancel&&r.onCancel()});return{showAlert:o,showConfirm:r=>o({...r,showCancelButton:!0,confirmButtonText:r.confirmButtonText||"Yes",cancelButtonText:r.cancelButtonText||"No",icon:r.icon||"question"}),showSuccess:(r,u)=>o({title:u||"Success",text:r,icon:"success"}),showError:(r,u)=>o({title:u||"Error",text:r,icon:"error"}),showWarning:(r,u)=>o({title:u||"Warning",text:r,icon:"warning"}),showInfo:(r,u)=>o({title:u||"Information",text:r,icon:"info"}),showLoading:r=>Qt.fire({title:r||"Processing...",allowOutsideClick:!1,allowEscapeKey:!1,showConfirmButton:!1,didOpen:()=>{Qt.showLoading()}}),closeLoading:()=>{Qt.close()}}},Fn=()=>{d.useEffect(()=>{const e=window.page?.props?.flash;e&&o(e);const t=l=>{const a=l.detail.page.props.flash;a&&o(a)};return Ys.on("navigate",t),()=>{}},[]);const o=e=>{e?.success&&w.success(e.success),e?.error&&w.error(e.error),e?.warning&&w.warning(e.warning),e?.info&&w.info(e.info)}},Cs=[{id:"mobile_money",nameKey:"taxpayer.checkout.methods.mobileMoney",providers:["M-PESA","Airtel Money","Orange Money"]},{id:"card",nameKey:"taxpayer.checkout.methods.bankCard",providers:["Visa","Mastercard"]},{id:"bank_transfer",nameKey:"taxpayer.checkout.methods.bankTransfer",providers:["All Banks"]}],fa=o=>{const e=ms.c(339),{order:t,taxpayerInfo:l}=o,[a,c]=d.useState(t.payment_method||"mobile_money"),[i,p]=d.useState(t.payment_provider||""),[r,u]=d.useState(""),[y,h]=d.useState(!1),[f,g]=d.useState(!1),m=On();Fn();const{t:n}=mn();let b;e[0]!==r||e[1]!==a||e[2]!==i?(b={payment_method:a,payment_provider:i,phone_number:r},e[0]=r,e[1]=a,e[2]=i,e[3]=b):b=e[3];const{setData:j,processing:Ks,errors:$t}=Xs(b),Vs=Mn;let Ot;e[4]!==j?(Ot=x=>{c(x),j("payment_method",x),p(""),x==="bank_transfer"&&w.info("Bank transfer requires downloading and presenting invoice at the bank")},e[4]=j,e[5]=Ot):Ot=e[5];const ss=Ot;let Ft;e[6]!==j?(Ft=x=>{p(x),j("payment_provider",x)},e[6]=j,e[7]=Ft):Ft=e[7];const ns=Ft;let Mt;e[8]!==j?(Mt=x=>{u(x.target.value),j("phone_number",x.target.value)},e[8]=j,e[9]=Mt):Mt=e[9];const as=Mt;let N;if(e[10]!==t.grand_total||e[11]!==r||e[12]!==a||e[13]!==m){N=Pt=>{if(Pt.preventDefault(),a==="mobile_money"&&r&&!r.match(/^(\+243|0)[0-9]{9}$/)){m.showError("Please enter a valid phone number for mobile money");return}m.showConfirm({title:"Confirm Payment",html:`
                <div style="text-align: left;">
                    <p><strong>Amount:</strong> ${v(parseFloat(t.grand_total))}</p>
                    <p><strong>Method:</strong> ${a}</p>
                    ${a==="mobile_money"?`<p><strong>Phone:</strong> ${r}</p>`:""}
                </div>
            `,icon:"question",confirmButtonText:"Yes, Proceed to Payment",cancelButtonText:"Cancel",onConfirm:()=>{x()}})};const x=()=>{h(!0),w.info("Online payment coming soon!")};e[10]=t.grand_total,e[11]=r,e[12]=a,e[13]=m,e[14]=N}else N=e[14];let C,_;if(e[15]!==t.grand_total||e[16]!==t.order_number||e[17]!==t.packaging_type||e[18]!==t.penalty_amount||e[19]!==t.product?.name||e[20]!==t.quantity||e[21]!==t.stamp_type?.name||e[22]!==t.tax_amount||e[23]!==t.total_amount||e[24]!==t.unit_price||e[25]!==a||e[26]!==m||e[27]!==l){_=()=>{m.showConfirm({title:"Download Invoice",html:`
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
            `,icon:"info",confirmButtonText:"Yes, Download Invoice",cancelButtonText:"Cancel",onConfirm:()=>{g(!0);const k=w.loading("Generating invoice...");Pt(),setTimeout(()=>{g(!1),w.dismiss(k),w.success("Invoice generated successfully"),m.showInfo("Remember to present the printed invoice at the bank with your payment.","Next Steps")},1e3)}})};let x;e[30]!==t.order_number||e[31]!==m?(x=()=>{m.showConfirm({title:"Cancel Order",html:`
                <div style="text-align: left;">
                    <p>Are you sure you want to cancel order #${t.order_number}?</p>
                    <p style="color: #d33; font-weight: bold;">This action cannot be undone!</p>
                </div>
            `,icon:"warning",confirmButtonText:"Yes, Cancel Order",cancelButtonText:"No, Keep Order",confirmButtonColor:"#d33",onConfirm:Ln})},e[30]=t.order_number,e[31]=m,e[32]=x):x=e[32],C=x;const Pt=()=>{const k=window.open("","_blank");if(!k){w.error("Please allow pop-ups to download the invoice"),g(!1);return}const ds=new Date().toLocaleDateString("en-US"),Us=new Date(Date.now()+6048e5).toLocaleDateString("en-US"),Hs=Vs(l),Ws=`
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
                            <strong>Date:</strong> ${ds} | 
                            <strong>Due:</strong> ${Us}
                        </div>
                        <span class="status-badge">PENDING PAYMENT</span>
                    </div>

                    <div class="info-grid">
                        <div class="info-box">
                            <h3>TAXPAYER DETAILS</h3>
                            <div class="info-row">
                                <span class="info-label">Company:</span>
                                <span class="info-value">${l.company_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">TIN:</span>
                                <span class="info-value">${l.tax_identification_number}</span>
                            </div>
                            ${l.trade_register_number?`
                            <div class="info-row">
                                <span class="info-label">RCCM:</span>
                                <span class="info-value">${l.trade_register_number}</span>
                            </div>
                            `:""}
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span class="info-value">${Hs}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">${l.phone_number}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${l.email}</span>
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
                        <strong>PAYMENT REF:</strong> ${t.order_number}-${l.tax_identification_number}
                    </div>

                    ${a==="bank_transfer"?`
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
        `;k.document.write(Ws),k.document.close()};e[15]=t.grand_total,e[16]=t.order_number,e[17]=t.packaging_type,e[18]=t.penalty_amount,e[19]=t.product?.name,e[20]=t.quantity,e[21]=t.stamp_type?.name,e[22]=t.tax_amount,e[23]=t.total_amount,e[24]=t.unit_price,e[25]=a,e[26]=m,e[27]=l,e[28]=C,e[29]=_}else C=e[28],_=e[29];let Lt;e[33]!==n?(Lt=x=>{const Pt={payment_pending:{color:"bg-yellow-100 text-yellow-800",icon:ks,label:n("taxpayer.checkout.statuses.paymentPending")},paid:{color:"bg-green-100 text-green-800",icon:Bt,label:n("taxpayer.checkout.statuses.paid")},processing:{color:"bg-blue-100 text-blue-800",icon:ks,label:n("taxpayer.checkout.statuses.processing")},completed:{color:"bg-green-100 text-green-800",icon:Bt,label:n("taxpayer.checkout.statuses.completed")},cancelled:{color:"bg-red-100 text-red-800",icon:_s,label:n("taxpayer.checkout.statuses.cancelled")}},k=Pt[x]||Pt.payment_pending,ds=k.icon;return s.jsxs(on,{className:`${k.color} flex items-center gap-1`,children:[s.jsx(ds,{className:"h-3 w-3"}),k.label]})},e[33]=n,e[34]=Lt):Lt=e[34];const os=Lt;let S;e[35]!==n?(S=n("taxpayer.checkout.completePayment"),e[35]=n,e[36]=S):S=e[36];let R;e[37]!==S?(R=s.jsx(Js,{title:S}),e[37]=S,e[38]=R):R=e[38];let P;e[39]!==n?(P=n("taxpayer.checkout.backToOrders"),e[39]=n,e[40]=P):P=e[40];let I;e[41]!==P?(I=s.jsxs(gs,{href:"taxpayer/orders?view=history",className:"text-sm text-muted-foreground hover:text-primary",children:["← ",P]}),e[41]=P,e[42]=I):I=e[42];let T;e[43]!==C||e[44]!==t.status||e[45]!==n?(T=t.status==="payment_pending"&&s.jsx(It,{variant:"destructive",size:"sm",onClick:C,children:n("taxpayer.checkout.cancelOrder")}),e[43]=C,e[44]=t.status,e[45]=n,e[46]=T):T=e[46];let A;e[47]!==T||e[48]!==I?(A=s.jsxs("div",{className:"mb-6 flex justify-between items-center",children:[I,T]}),e[47]=T,e[48]=I,e[49]=A):A=e[49];let D;e[50]!==n?(D=n("taxpayer.checkout.completePayment"),e[50]=n,e[51]=D):D=e[51];let E;e[52]!==D?(E=s.jsx(Tt,{className:"text-2xl",children:D}),e[52]=D,e[53]=E):E=e[53];let B;e[54]!==n?(B=n("taxpayer.checkout.orderNumber"),e[54]=n,e[55]=B):B=e[55];let $;e[56]!==t.order_number||e[57]!==B?($=s.jsxs(an,{children:[B," #",t.order_number]}),e[56]=t.order_number,e[57]=B,e[58]=$):$=e[58];let O;e[59]!==E||e[60]!==$?(O=s.jsxs("div",{children:[E,$]}),e[59]=E,e[60]=$,e[61]=O):O=e[61];let F;e[62]!==os||e[63]!==t.status?(F=os(t.status),e[62]=os,e[63]=t.status,e[64]=F):F=e[64];let M;e[65]!==O||e[66]!==F?(M=s.jsx(At,{children:s.jsxs("div",{className:"flex justify-between items-start",children:[O,F]})}),e[65]=O,e[66]=F,e[67]=M):M=e[67];let L;e[68]!==n?(L=n("taxpayer.checkout.orderDetails"),e[68]=n,e[69]=L):L=e[69];let G;e[70]!==L?(G=s.jsx("h3",{className:"font-semibold mb-3",children:L}),e[70]=L,e[71]=G):G=e[71];let z;e[72]!==n?(z=n("taxpayer.checkout.quantity"),e[72]=n,e[73]=z):z=e[73];let q;e[74]!==z?(q=s.jsx("p",{className:"text-muted-foreground",children:z}),e[74]=z,e[75]=q):q=e[75];let K;e[76]!==t.quantity?(K=t.quantity.toLocaleString(),e[76]=t.quantity,e[77]=K):K=e[77];let V;e[78]!==n?(V=n("taxpayer.checkout.stamps"),e[78]=n,e[79]=V):V=e[79];let U;e[80]!==K||e[81]!==V?(U=s.jsxs("p",{className:"font-medium",children:[K," ",V]}),e[80]=K,e[81]=V,e[82]=U):U=e[82];let H;e[83]!==q||e[84]!==U?(H=s.jsxs("div",{children:[q,U]}),e[83]=q,e[84]=U,e[85]=H):H=e[85];let W;e[86]!==n?(W=n("taxpayer.checkout.packaging"),e[86]=n,e[87]=W):W=e[87];let Y;e[88]!==W?(Y=s.jsx("p",{className:"text-muted-foreground",children:W}),e[88]=W,e[89]=Y):Y=e[89];let X;e[90]!==t.packaging_type?(X=s.jsx("p",{className:"font-medium capitalize",children:t.packaging_type}),e[90]=t.packaging_type,e[91]=X):X=e[91];let J;e[92]!==Y||e[93]!==X?(J=s.jsxs("div",{children:[Y,X]}),e[92]=Y,e[93]=X,e[94]=J):J=e[94];let Q;e[95]!==n?(Q=n("taxpayer.checkout.deliveryMethod"),e[95]=n,e[96]=Q):Q=e[96];let Z;e[97]!==Q?(Z=s.jsx("p",{className:"text-muted-foreground",children:Q}),e[97]=Q,e[98]=Z):Z=e[98];let ee;e[99]!==t.delivery_method?(ee=s.jsx("p",{className:"font-medium capitalize",children:t.delivery_method}),e[99]=t.delivery_method,e[100]=ee):ee=e[100];let te;e[101]!==Z||e[102]!==ee?(te=s.jsxs("div",{children:[Z,ee]}),e[101]=Z,e[102]=ee,e[103]=te):te=e[103];let se;e[104]!==n?(se=n("taxpayer.checkout.orderDate"),e[104]=n,e[105]=se):se=e[105];let ne;e[106]!==se?(ne=s.jsx("p",{className:"text-muted-foreground",children:se}),e[106]=se,e[107]=ne):ne=e[107];let ae;e[108]!==t.created_at?(ae=ys(t.created_at),e[108]=t.created_at,e[109]=ae):ae=e[109];let oe;e[110]!==ae?(oe=s.jsx("p",{className:"font-medium",children:ae}),e[110]=ae,e[111]=oe):oe=e[111];let re;e[112]!==ne||e[113]!==oe?(re=s.jsxs("div",{children:[ne,oe]}),e[112]=ne,e[113]=oe,e[114]=re):re=e[114];let le;e[115]!==H||e[116]!==J||e[117]!==te||e[118]!==re?(le=s.jsxs("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[H,J,te,re]}),e[115]=H,e[116]=J,e[117]=te,e[118]=re,e[119]=le):le=e[119];let ie;e[120]!==G||e[121]!==le?(ie=s.jsxs("div",{className:"bg-muted/50 p-4 rounded-lg",children:[G,le]}),e[120]=G,e[121]=le,e[122]=ie):ie=e[122];let ce;e[123]!==n?(ce=n("taxpayer.checkout.selectPaymentMethod"),e[123]=n,e[124]=ce):ce=e[124];let de;e[125]!==ce?(de=s.jsx("h3",{className:"font-semibold",children:ce}),e[125]=ce,e[126]=de):de=e[126];let pe;e[127]!==n?(pe=Cs.map(x=>s.jsxs("div",{className:"flex items-start space-x-3 space-y-0",children:[s.jsx(hs,{value:x.id,id:x.id}),s.jsx(Zt,{htmlFor:x.id,className:"font-medium cursor-pointer",children:n(x.nameKey)})]},x.id)),e[127]=n,e[128]=pe):pe=e[128];let ue;e[129]!==ss||e[130]!==a||e[131]!==pe?(ue=s.jsx(us,{value:a,onValueChange:ss,children:pe}),e[129]=ss,e[130]=a,e[131]=pe,e[132]=ue):ue=e[132];let me;e[133]!==$t||e[134]!==as||e[135]!==ns||e[136]!==r||e[137]!==a||e[138]!==i||e[139]!==n?(me=a==="mobile_money"&&s.jsxs("div",{className:"mt-4 space-y-4",children:[s.jsxs("div",{children:[s.jsx(Zt,{htmlFor:"provider",children:n("taxpayer.checkout.selectProvider")}),s.jsx(us,{value:i,onValueChange:ns,className:"flex flex-wrap gap-4 mt-2",children:Cs.find(Gn)?.providers.map(zn)})]}),s.jsxs("div",{children:[s.jsx(Zt,{htmlFor:"phone",children:n("taxpayer.checkout.phoneNumber")}),s.jsx(un,{id:"phone",type:"tel",placeholder:n("taxpayer.checkout.phoneNumberPlaceholder"),value:r,onChange:as,required:a==="mobile_money"}),$t.phone_number&&s.jsx("p",{className:"text-sm text-red-500 mt-1",children:$t.phone_number})]})]}),e[133]=$t,e[134]=as,e[135]=ns,e[136]=r,e[137]=a,e[138]=i,e[139]=n,e[140]=me):me=e[140];let fe;e[141]!==a||e[142]!==n?(fe=a==="card"&&s.jsxs(vs,{className:"mt-4",children:[s.jsx(_s,{className:"h-4 w-4"}),s.jsx(ws,{children:n("taxpayer.checkout.methods.bankCard")}),s.jsx(js,{children:n("taxpayer.checkout.cardPaymentAlert")})]}),e[141]=a,e[142]=n,e[143]=fe):fe=e[143];let xe;e[144]!==a||e[145]!==n?(xe=a==="bank_transfer"&&s.jsxs(vs,{className:"mt-4",children:[s.jsx(fn,{className:"h-4 w-4"}),s.jsx(ws,{children:n("taxpayer.checkout.methods.bankTransfer")}),s.jsx(js,{children:n("taxpayer.checkout.bankTransferAlert")})]}),e[144]=a,e[145]=n,e[146]=xe):xe=e[146];let he;e[147]!==de||e[148]!==ue||e[149]!==me||e[150]!==fe||e[151]!==xe?(he=s.jsxs("div",{className:"space-y-4",children:[de,ue,me,fe,xe]}),e[147]=de,e[148]=ue,e[149]=me,e[150]=fe,e[151]=xe,e[152]=he):he=e[152];let Gt;e[153]===Symbol.for("react.memo_cache_sentinel")?(Gt=s.jsx(bs,{className:"my-6"}),e[153]=Gt):Gt=e[153];let ge;e[154]!==n?(ge=n("taxpayer.checkout.subtotal"),e[154]=n,e[155]=ge):ge=e[155];let ye;e[156]!==ge?(ye=s.jsx("span",{className:"text-muted-foreground",children:ge}),e[156]=ge,e[157]=ye):ye=e[157];const rs=parseFloat(t.total_amount);let be;e[158]!==rs?(be=v(rs),e[158]=rs,e[159]=be):be=e[159];let ve;e[160]!==be?(ve=s.jsx("span",{children:be}),e[160]=be,e[161]=ve):ve=e[161];let we;e[162]!==ye||e[163]!==ve?(we=s.jsxs("div",{className:"flex justify-between text-sm",children:[ye,ve]}),e[162]=ye,e[163]=ve,e[164]=we):we=e[164];let je;e[165]!==n?(je=n("taxpayer.checkout.vat"),e[165]=n,e[166]=je):je=e[166];let _e;e[167]!==je?(_e=s.jsx("span",{className:"text-muted-foreground",children:je}),e[167]=je,e[168]=_e):_e=e[168];const ls=parseFloat(t.tax_amount);let ke;e[169]!==ls?(ke=v(ls),e[169]=ls,e[170]=ke):ke=e[170];let Ne;e[171]!==ke?(Ne=s.jsx("span",{children:ke}),e[171]=ke,e[172]=Ne):Ne=e[172];let Ce;e[173]!==_e||e[174]!==Ne?(Ce=s.jsxs("div",{className:"flex justify-between text-sm",children:[_e,Ne]}),e[173]=_e,e[174]=Ne,e[175]=Ce):Ce=e[175];let Se;e[176]!==t.penalty_amount||e[177]!==n?(Se=parseFloat(t.penalty_amount)>0&&s.jsxs("div",{className:"flex justify-between text-sm",children:[s.jsx("span",{className:"text-muted-foreground",children:n("taxpayer.checkout.penalties")}),s.jsx("span",{className:"text-red-600",children:v(parseFloat(t.penalty_amount))})]}),e[176]=t.penalty_amount,e[177]=n,e[178]=Se):Se=e[178];let zt;e[179]===Symbol.for("react.memo_cache_sentinel")?(zt=s.jsx(bs,{className:"my-2"}),e[179]=zt):zt=e[179];let Re;e[180]!==n?(Re=n("taxpayer.checkout.total"),e[180]=n,e[181]=Re):Re=e[181];let Pe;e[182]!==Re?(Pe=s.jsx("span",{children:Re}),e[182]=Re,e[183]=Pe):Pe=e[183];const is=parseFloat(t.grand_total);let Ie;e[184]!==is?(Ie=v(is),e[184]=is,e[185]=Ie):Ie=e[185];let Te;e[186]!==Ie?(Te=s.jsx("span",{children:Ie}),e[186]=Ie,e[187]=Te):Te=e[187];let Ae;e[188]!==Pe||e[189]!==Te?(Ae=s.jsxs("div",{className:"flex justify-between font-semibold text-lg",children:[Pe,Te]}),e[188]=Pe,e[189]=Te,e[190]=Ae):Ae=e[190];let De;e[191]!==we||e[192]!==Ce||e[193]!==Se||e[194]!==Ae?(De=s.jsxs("div",{className:"space-y-2",children:[we,Ce,Se,zt,Ae]}),e[191]=we,e[192]=Ce,e[193]=Se,e[194]=Ae,e[195]=De):De=e[195];let qt;e[196]===Symbol.for("react.memo_cache_sentinel")?(qt=s.jsx(Ns,{className:"h-4 w-4"}),e[196]=qt):qt=e[196];let Ee;e[197]!==f||e[198]!==n?(Ee=n(f?"taxpayer.checkout.generating":"taxpayer.checkout.downloadInvoiceBank"),e[197]=f,e[198]=n,e[199]=Ee):Ee=e[199];let Be;e[200]!==_||e[201]!==f||e[202]!==Ee?(Be=s.jsxs(It,{type:"button",variant:"outline",className:"w-full flex items-center justify-center gap-2",onClick:_,disabled:f,children:[qt,Ee]}),e[200]=_,e[201]=f,e[202]=Ee,e[203]=Be):Be=e[203];const cs=Ks||y||a==="mobile_money"&&(!i||!r);let $e;e[204]!==y||e[205]!==t.grand_total||e[206]!==n?($e=y?n("taxpayer.checkout.processingPayment"):`${n("taxpayer.checkout.payOnline")} ${v(parseFloat(t.grand_total))}`,e[204]=y,e[205]=t.grand_total,e[206]=n,e[207]=$e):$e=e[207];let Oe;e[208]!==cs||e[209]!==$e?(Oe=s.jsx(It,{type:"submit",className:"w-full",disabled:cs,children:$e}),e[208]=cs,e[209]=$e,e[210]=Oe):Oe=e[210];let Fe;e[211]!==Be||e[212]!==Oe?(Fe=s.jsxs("div",{className:"mt-6 space-y-3",children:[Be,Oe]}),e[211]=Be,e[212]=Oe,e[213]=Fe):Fe=e[213];let Me;e[214]!==N||e[215]!==he||e[216]!==De||e[217]!==Fe?(Me=s.jsxs("form",{onSubmit:N,children:[he,Gt,De,Fe]}),e[214]=N,e[215]=he,e[216]=De,e[217]=Fe,e[218]=Me):Me=e[218];let Le;e[219]!==ie||e[220]!==Me?(Le=s.jsx(Dt,{children:s.jsxs("div",{className:"space-y-6",children:[ie,Me]})}),e[219]=ie,e[220]=Me,e[221]=Le):Le=e[221];let Ge;e[222]!==M||e[223]!==Le?(Ge=s.jsx("div",{className:"lg:col-span-2",children:s.jsxs(Et,{children:[M,Le]})}),e[222]=M,e[223]=Le,e[224]=Ge):Ge=e[224];let Kt;e[225]===Symbol.for("react.memo_cache_sentinel")?(Kt=s.jsx(tn,{className:"h-5 w-5"}),e[225]=Kt):Kt=e[225];let ze;e[226]!==n?(ze=n("taxpayer.checkout.bankPaymentOption"),e[226]=n,e[227]=ze):ze=e[227];let qe;e[228]!==ze?(qe=s.jsx(At,{className:"pb-2",children:s.jsxs(Tt,{className:"text-lg flex items-center gap-2 text-blue-700",children:[Kt,ze]})}),e[228]=ze,e[229]=qe):qe=e[229];let Ke;e[230]!==n?(Ke=n("taxpayer.checkout.bankPaymentDesc"),e[230]=n,e[231]=Ke):Ke=e[231];let Ve;e[232]!==Ke?(Ve=s.jsx("p",{className:"text-sm text-blue-800 mb-3",children:Ke}),e[232]=Ke,e[233]=Ve):Ve=e[233];let Vt;e[234]===Symbol.for("react.memo_cache_sentinel")?(Vt=s.jsx(Ns,{className:"h-4 w-4"}),e[234]=Vt):Vt=e[234];let Ue;e[235]!==f||e[236]!==n?(Ue=n(f?"taxpayer.checkout.generating":"taxpayer.checkout.downloadInvoice"),e[235]=f,e[236]=n,e[237]=Ue):Ue=e[237];let He;e[238]!==_||e[239]!==f||e[240]!==Ue?(He=s.jsxs(It,{variant:"default",className:"w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2",onClick:_,disabled:f,children:[Vt,Ue]}),e[238]=_,e[239]=f,e[240]=Ue,e[241]=He):He=e[241];let We;e[242]!==n?(We=n("taxpayer.checkout.afterBankPayment"),e[242]=n,e[243]=We):We=e[243];let Ye;e[244]!==We?(Ye=s.jsx("div",{className:"mt-3 text-xs text-blue-600",children:s.jsx("p",{children:We})}),e[244]=We,e[245]=Ye):Ye=e[245];let Xe;e[246]!==Ve||e[247]!==He||e[248]!==Ye?(Xe=s.jsxs(Dt,{children:[Ve,He,Ye]}),e[246]=Ve,e[247]=He,e[248]=Ye,e[249]=Xe):Xe=e[249];let Je;e[250]!==qe||e[251]!==Xe?(Je=s.jsxs(Et,{className:"border-2 border-blue-200 bg-blue-50",children:[qe,Xe]}),e[250]=qe,e[251]=Xe,e[252]=Je):Je=e[252];let Ut;e[253]===Symbol.for("react.memo_cache_sentinel")?(Ut=s.jsx(xn,{className:"h-5 w-5"}),e[253]=Ut):Ut=e[253];let Qe;e[254]!==n?(Qe=n("taxpayer.checkout.deliveryInfo"),e[254]=n,e[255]=Qe):Qe=e[255];let Ze;e[256]!==Qe?(Ze=s.jsx(At,{children:s.jsxs(Tt,{className:"text-lg flex items-center gap-2",children:[Ut,Qe]})}),e[256]=Qe,e[257]=Ze):Ze=e[257];let et;e[258]!==n?(et=n("taxpayer.checkout.method"),e[258]=n,e[259]=et):et=e[259];let tt;e[260]!==et?(tt=s.jsxs("span",{className:"text-muted-foreground",children:[et,":"]}),e[260]=et,e[261]=tt):tt=e[261];let st;e[262]!==t.delivery_method?(st=s.jsx("span",{className:"font-medium capitalize",children:t.delivery_method}),e[262]=t.delivery_method,e[263]=st):st=e[263];let nt;e[264]!==tt||e[265]!==st?(nt=s.jsxs("p",{children:[tt," ",st]}),e[264]=tt,e[265]=st,e[266]=nt):nt=e[266];let at;e[267]!==t.delivery_address||e[268]!==n?(at=t.delivery_address&&s.jsxs("p",{children:[s.jsxs("span",{className:"text-muted-foreground",children:[n("taxpayer.checkout.address"),":"]})," ",s.jsx("span",{className:"font-medium",children:t.delivery_address})]}),e[267]=t.delivery_address,e[268]=n,e[269]=at):at=e[269];let ot;e[270]!==t.estimated_delivery_date||e[271]!==n?(ot=t.estimated_delivery_date&&s.jsxs("p",{children:[s.jsxs("span",{className:"text-muted-foreground",children:[n("taxpayer.checkout.estimatedDelivery"),":"]})," ",s.jsx("span",{className:"font-medium",children:ys(t.estimated_delivery_date)})]}),e[270]=t.estimated_delivery_date,e[271]=n,e[272]=ot):ot=e[272];let rt;e[273]!==nt||e[274]!==at||e[275]!==ot?(rt=s.jsx(Dt,{children:s.jsxs("div",{className:"space-y-2 text-sm",children:[nt,at,ot]})}),e[273]=nt,e[274]=at,e[275]=ot,e[276]=rt):rt=e[276];let lt;e[277]!==rt||e[278]!==Ze?(lt=s.jsxs(Et,{children:[Ze,rt]}),e[277]=rt,e[278]=Ze,e[279]=lt):lt=e[279];let Ht;e[280]===Symbol.for("react.memo_cache_sentinel")?(Ht=s.jsx(hn,{className:"h-5 w-5"}),e[280]=Ht):Ht=e[280];let it;e[281]!==n?(it=n("taxpayer.checkout.requiredDocuments"),e[281]=n,e[282]=it):it=e[282];let ct;e[283]!==it?(ct=s.jsx(At,{children:s.jsxs(Tt,{className:"text-lg flex items-center gap-2",children:[Ht,it]})}),e[283]=it,e[284]=ct):ct=e[284];let Wt;e[285]===Symbol.for("react.memo_cache_sentinel")?(Wt=s.jsx(Bt,{className:"h-4 w-4 text-green-500"}),e[285]=Wt):Wt=e[285];let dt;e[286]!==n?(dt=n("taxpayer.checkout.importDeclaration"),e[286]=n,e[287]=dt):dt=e[287];let pt;e[288]!==dt?(pt=s.jsxs("li",{className:"flex items-center gap-2",children:[Wt,dt]}),e[288]=dt,e[289]=pt):pt=e[289];let Yt;e[290]===Symbol.for("react.memo_cache_sentinel")?(Yt=s.jsx(Bt,{className:"h-4 w-4 text-green-500"}),e[290]=Yt):Yt=e[290];let ut;e[291]!==n?(ut=n("taxpayer.checkout.marketingAuth"),e[291]=n,e[292]=ut):ut=e[292];let mt;e[293]!==ut?(mt=s.jsxs("li",{className:"flex items-center gap-2",children:[Yt,ut]}),e[293]=ut,e[294]=mt):mt=e[294];let Xt;e[295]===Symbol.for("react.memo_cache_sentinel")?(Xt=s.jsx(Bt,{className:"h-4 w-4 text-green-500"}),e[295]=Xt):Xt=e[295];let ft;e[296]!==n?(ft=n("taxpayer.checkout.certOfConformity"),e[296]=n,e[297]=ft):ft=e[297];let xt;e[298]!==ft?(xt=s.jsxs("li",{className:"flex items-center gap-2",children:[Xt,ft]}),e[298]=ft,e[299]=xt):xt=e[299];let ht;e[300]!==pt||e[301]!==mt||e[302]!==xt?(ht=s.jsx(Dt,{children:s.jsxs("ul",{className:"space-y-2 text-sm",children:[pt,mt,xt]})}),e[300]=pt,e[301]=mt,e[302]=xt,e[303]=ht):ht=e[303];let gt;e[304]!==ct||e[305]!==ht?(gt=s.jsxs(Et,{children:[ct,ht]}),e[304]=ct,e[305]=ht,e[306]=gt):gt=e[306];let yt;e[307]!==n?(yt=n("taxpayer.checkout.needHelp"),e[307]=n,e[308]=yt):yt=e[308];let bt;e[309]!==yt?(bt=s.jsx(At,{children:s.jsx(Tt,{className:"text-lg",children:yt})}),e[309]=yt,e[310]=bt):bt=e[310];let vt;e[311]!==n?(vt=n("taxpayer.checkout.needHelpDesc"),e[311]=n,e[312]=vt):vt=e[312];let wt;e[313]!==vt?(wt=s.jsx("p",{className:"text-sm text-muted-foreground mb-3",children:vt}),e[313]=vt,e[314]=wt):wt=e[314];let jt;e[315]!==n?(jt=n("taxpayer.checkout.contactSupport"),e[315]=n,e[316]=jt):jt=e[316];let _t;e[317]!==jt?(_t=s.jsx(It,{variant:"outline",className:"w-full",asChild:!0,children:s.jsx(gs,{href:"/help",children:jt})}),e[317]=jt,e[318]=_t):_t=e[318];let kt;e[319]!==wt||e[320]!==_t?(kt=s.jsxs(Dt,{children:[wt,_t]}),e[319]=wt,e[320]=_t,e[321]=kt):kt=e[321];let Nt;e[322]!==bt||e[323]!==kt?(Nt=s.jsxs(Et,{children:[bt,kt]}),e[322]=bt,e[323]=kt,e[324]=Nt):Nt=e[324];let Ct;e[325]!==lt||e[326]!==gt||e[327]!==Nt||e[328]!==Je?(Ct=s.jsx("div",{className:"lg:col-span-1",children:s.jsxs("div",{className:"space-y-4",children:[Je,lt,gt,Nt]})}),e[325]=lt,e[326]=gt,e[327]=Nt,e[328]=Je,e[329]=Ct):Ct=e[329];let St;e[330]!==Ct||e[331]!==Ge?(St=s.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[Ge,Ct]}),e[330]=Ct,e[331]=Ge,e[332]=St):St=e[332];let Rt;e[333]!==A||e[334]!==St?(Rt=s.jsxs("div",{className:"container mx-auto py-8 px-4 max-w-6xl",children:[A,St]}),e[333]=A,e[334]=St,e[335]=Rt):Rt=e[335];let Jt;return e[336]!==Rt||e[337]!==R?(Jt=s.jsxs(sn,{children:[R,Rt]}),e[336]=Rt,e[337]=R,e[338]=Jt):Jt=e[338],Jt};function Mn(o){return[o.physical_address,o.avenue,o.number?`No. ${o.number}`:null,o.plot_number?`Plot ${o.plot_number}`:null].filter(Boolean).join(", ")||"Address not provided"}function Ln(){w.info("Order cancelling coming soon...")}function Gn(o){return o.id==="mobile_money"}function zn(o){return s.jsxs("div",{className:"flex items-center space-x-2",children:[s.jsx(hs,{value:o,id:o}),s.jsx(Zt,{htmlFor:o,children:o})]},o)}export{fa as default};
