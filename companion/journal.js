const root = document.querySelector('#record');
function el(tag,text){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node}
function field(list,label,value){const row=el('div');row.append(el('dt',label),el('dd',value));list.append(row)}
function disclosure(view,id,title,subtitle,detail){const row=el('details');row.id=id;const summary=el('summary',title);summary.append(el('small',subtitle));row.append(summary,el('p',detail));view.append(row);return row}
async function init(){
 const response=await fetch('./campaign.json',{cache:'no-cache'});if(!response.ok)throw Error();const data=await response.json();
 document.querySelector('#checkpoint').textContent=data.checkpoint;root.replaceChildren();
 const nav=document.querySelector('nav'),views={};
 for(const key of ['Character','Skills','Inventory','Story']){const id=key.toLowerCase(),link=el('a',key),view=el('article');link.href='#'+id;nav.append(link);view.id=id;view.append(el('h1',key));root.append(view);views[id]=view}
 const c=data.character,stats=el('dl');const sheet=el('div');sheet.className='sheet';stats.className='stats';
 const plate=el('a');plate.className='plate';plate.href='./arrival.jpg';plate.setAttribute('aria-label','Open full arrival portrait');
 const art=el('img');art.src=plate.href;art.width=600;art.height=900;art.alt='Arrival portrait in woodland, wearing your blue shirt and pendant';plate.append(art,el('span','View portrait ↗'));
 sheet.append(plate,stats);views.character.append(sheet);field(stats,'Mana reserves',c.reserve);field(stats,'Affinity',c.affinity);field(stats,'Appearance at arrival',c.appearance);field(stats,'Defining trait',c.trait);
 for(const s of data.skills){disclosure(views.skills,s.id,'◇ '+s.name,s.assessment+' · '+s.summary,s.detail)}
 for(const group of new Set(data.inventory.map(i=>i.location))){views.inventory.append(el('h2',group));for(const item of data.inventory.filter(i=>i.location===group)){disclosure(views.inventory,item.id,item.name,item.status+' · Quantity '+item.quantity,item.description+' Recorded from: '+item.source+'.')}}
 views.story.append(el('small','Arrival premise'));for(const event of data.story){const entry=el('section');entry.className='story';entry.id=event.id;entry.append(el('h2',event.title),el('p',event.text));views.story.append(entry)}
 function show(){const raw=location.hash.slice(1),id=({mana:'skills',origin:'story'})[raw]||raw;const target=document.getElementById(id);const view=target?.closest('article')||views.character;for(const v of Object.values(views))v.hidden=v!==view;for(const a of nav.children){if(a.hash==='#'+view.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}if(target?.tagName==='DETAILS')target.open=true}
 show();window.addEventListener('hashchange',show)
}
init().catch(()=>root.textContent='Campaign record unavailable. Refresh to retry.');
