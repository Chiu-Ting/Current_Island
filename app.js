(() => {
  const courses = window.COURSES || [];
  const specialty = [
    {name:'資訊科技領域', icon:'⌘', subtitle:'程式、資料與運算', keys:['程式','微處理機','交換電路','資料結構'], description:'從程式設計、邏輯電路與計算機基礎，探索資訊處理的不同面向。', projects:['以感測資料製作簡易環境監測器','設計一個小型資料分類程式']},
    {name:'電波領域', icon:'⌁', subtitle:'電磁波與無線訊號', keys:['電磁學','電磁波','通訊工程','複變函數'], description:'從電磁學延伸到電磁波與訊號傳遞，認識無線世界的工程基礎。', projects:['模擬天線方向與訊號強度','觀察不同環境對無線訊號的影響']},
    {name:'固態電子領域', icon:'◈', subtitle:'半導體與電子元件', keys:['電子學','電子學實驗','半導體物理'], description:'認識電子元件的特性與電子電路如何運作，從理論走進實驗觀察。', projects:['比較不同元件的電路響應','以簡單電路呈現感測器訊號']},
    {name:'電力與電子電路領域', icon:'ϟ', subtitle:'電路與電能應用', keys:['電路學','電子學','電機機械'], description:'沿著電路學與電子學，探索電能如何轉換、控制並應用於設備。', projects:['製作可調式直流電源原型','分析小型馬達的驅動電路']},
    {name:'控制領域', icon:'◎', subtitle:'系統分析與自動控制', keys:['工程數學','訊號與系統','自動控制'], description:'透過數學模型與回授概念，理解系統如何依照目標穩定運作。', projects:['模擬溫度回授控制','讓小車沿著標線行進']},
    {name:'通訊與訊號處理領域', icon:'≋', subtitle:'訊號、機率與通訊', keys:['機率學','訊號與系統','通訊工程'], description:'從機率與訊號系統出發，看看資訊如何編碼、傳送及分析。', projects:['比較不同雜訊下的訊號品質','以簡單濾波處理聲音資料']}
  ];
  const studentStories=[
    {year:1,name:'大一・剛上島',mood:'新鮮，也有點不確定',line:'「我第一次把程式寫出來，原來一個小小的邏輯也能讓東西動起來。」'},
    {year:2,name:'大二・找線索',mood:'開始看見連結',line:'「修過電路學後，電子學裡的元件不再只是圖上的符號了。」'},
    {year:3,name:'大三・選方向',mood:'想多試幾種可能',line:'「不同領域都很有趣，我想先從課程和實驗找出最想追問的問題。」'},
    {year:4,name:'大四・做專題',mood:'把想法做出來',line:'「專題讓我把之前學過的工具放在一起，慢慢完成一個可以展示的成果。」'}
  ];
  const missions=[
    {id:'foundation',title:'找出基礎課程如何連到電路學',hint:'從「微積分」查看相關學習課程。',course:'微積分'},
    {id:'current',title:'選一條感興趣的專業航線',hint:'點選六大領域任一入口。'},
    {id:'core',title:'認識一門核心課程',hint:'搜尋或點選六門核心課程之一。',category:'核心課程'}
  ];
  const relation = {
    '微積分':['工程數學(Ⅰ)','工程數學(Ⅱ)','電路學'],
    '普通物理':['電磁學','電磁波','電路學'],
    '程式設計':['程式設計實習','微處理機概論','資料結構'],
    '電路學':['電子學','電子學實驗','電機機械'],
    '線性代數':['訊號與系統','自動控制'],
    '工程數學(Ⅰ)':['工程數學(Ⅱ)','訊號與系統','電磁學'],
    '機率學':['訊號與系統','通訊工程'],
    '電磁學':['電磁波','通訊工程'],
    '訊號與系統':['通訊工程','自動控制'],
    '資料結構':['程式設計','程式設計實習'],
    '自動控制':['訊號與系統','工程數學(Ⅱ)'],
    '半導體物理':['電子學','電子學實驗'],
    '電機機械':['電路學','電子學'],
    '複變函數':['工程數學(Ⅰ)','電磁學'],
    '通訊工程':['機率學','訊號與系統','電磁波']
  };
  const guide = [
    '大學四年就像一趟航程。先用數學、物理與程式打好底，再把基礎帶進電路、訊號和專業實作。',
    '大二開始，電路學、電子學與工程數學逐步串起來。這些課程會讓你看懂元件怎麼工作、訊號如何變化。',
    '到了高年級，你可以從六條專業航線找到興趣，再用專題研究把想法做成看得見的成果。',
    '還不確定要走哪一條路也沒關係。點選不同領域，看看核心課程如何連到更專業的方向。'
  ];
  let state = {year:null, filter:'全部', query:'', selected:null, specialty:null, guide:0, tourStage:0};
  const readStore=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  let favorites=readStore('ntou-ee-favorites',[]), completed=readStore('ntou-ee-missions',[]);
  const $ = (s) => document.querySelector(s);
  const list = $('#course-list');
  const termText = c => c.terms.length ? c.terms.map(t=>`大${t.year}${t.semester}`).join('、') : '依課程規定';
  function shownCourses(){
    return courses.filter(c=>{
      const yearOk = !state.year || c.terms.some(t=>t.year===state.year);
      const categoryOk = state.filter==='全部' || c.category===state.filter;
      const queryOk = !state.query || `${c.name} ${c.codes.join(' ')} ${c.category}`.toLowerCase().includes(state.query.toLowerCase());
      const selected = courses.find(x=>x.name===state.selected);
      const related = state.selected && (relation[state.selected]||[]).includes(c.name);
      const linked = !state.specialty || state.specialty.keys.some(k=>c.name.includes(k));
      return yearOk && categoryOk && queryOk && (!state.specialty || linked) && (!state.selected || c.name===state.selected || related || (selected && (relation[c.name]||[]).includes(state.selected)));
    });
  }
  function renderCourses(){
    const shown=shownCourses();
    $('#panel-title').textContent = state.year ? `大${state.year}課程探索` : state.specialty ? state.specialty.name : state.selected ? '課程關聯探索' : '課程探索';
    $('#course-count').textContent=`${shown.length} 門課程`;
    list.innerHTML = shown.length ? shown.map(c=>{
      const active=c.name===state.selected, related=state.selected && (relation[state.selected]||[]).includes(c.name);
      return `<article class="course-item ${active?'selected':''} ${related?'related':''} ${active?'expanded':''}" data-name="${esc(c.name)}" tabindex="0" role="button" aria-label="查看${esc(c.name)}課程資訊"><div class="course-top"><span class="course-name">${esc(c.name)}</span><span class="course-card-actions"><span class="course-credits">${c.credits==null?'未逐門標示':`${c.credits} 學分`}</span><button class="fav-btn ${favorites.includes(c.name)?'saved':''}" aria-label="${favorites.includes(c.name)?'取消收藏':'收藏'}${esc(c.name)}">${favorites.includes(c.name)?'♥':'♡'}</button></span></div><div class="course-meta"><span class="course-badge">${esc(shortCategory(c.category))}</span><span class="term-list">${esc(termText(c))}</span></div><div class="course-note">${c.codes.length?`課號：${esc(c.codes.join('、'))}<br>`:''}${c.note?`課程備註：${esc(c.note)}`:'依課程表安排修習。'}${related?'<br>✦ 課程關聯圖中的相關學習內容（非正式先修規定）':''}</div></article>`;
    }).join('') : '<div class="empty-state">找不到符合條件的課程，試試其他關鍵字。</div>';
    list.querySelectorAll('.course-item').forEach(el=>{
      const open=()=>{const previous=state.selected;state.selected=state.selected===el.dataset.name?null:el.dataset.name;state.specialty=null;renderSpecialtyDetail(null);document.querySelectorAll('.specialty-card').forEach(x=>x.classList.remove('active'));if(previous==='微積分'&&(relation[previous]||[]).includes(el.dataset.name))completeMission('foundation');if(courses.find(c=>c.name===el.dataset.name)?.category==='核心課程')completeMission('core');renderCourses()};
      el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
      el.querySelector('.fav-btn').addEventListener('click',e=>{e.stopPropagation();toggleFavorite(el.dataset.name)});
    });
    updateRoute();renderFavorites();
  }
  function shortCategory(s){return s==='系訂專業必修'?'專業必修':s==='系訂專業必選修'?'必選修':s==='核心課程'?'核心課程':'共同教育'}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function toggleFavorite(name){favorites=favorites.includes(name)?favorites.filter(x=>x!==name):[...favorites,name];localStorage.setItem('ntou-ee-favorites',JSON.stringify(favorites));renderCourses()}
  function renderFavorites(){
    $('#favorite-count').textContent=favorites.length;
    $('#favorite-list').innerHTML=favorites.length?favorites.map(name=>`<button class="favorite-item" data-favorite="${esc(name)}"><span>♡ ${esc(name)}</span><b>→</b></button>`).join(''):'<p>點課程旁的 ♡，收藏想進一步了解的課。</p>';
    document.querySelectorAll('.favorite-item').forEach(btn=>btn.addEventListener('click',()=>{state.year=null;state.filter='全部';state.query='';state.specialty=null;state.selected=btn.dataset.favorite;$('#course-search').value='';document.querySelectorAll('.year-node,.specialty-card').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='全部'));renderCourses()}));
  }
  function updateRoute(){
    const panel=$('#route-panel'), related=relation[state.selected]||[];
    panel.classList.toggle('hidden',!state.selected||!related.length);
    if(state.selected&&related.length){$('#route-stops').innerHTML=[state.selected,...related].map((name,i)=>`<button class="route-stop ${i===0?'route-origin':''}" data-route="${esc(name)}"><span>${i+1}</span>${esc(name)}</button>`).join('');document.querySelectorAll('.route-stop').forEach(btn=>btn.addEventListener('click',()=>{const previous=state.selected;state.selected=btn.dataset.route;if(previous==='微積分'&&relation[previous].includes(state.selected))completeMission('foundation');renderCourses()}))}
    document.querySelectorAll('.year-node').forEach(node=>{const y=+node.dataset.year;const names=[state.selected,...related];node.classList.toggle('path-year',!!state.selected&&names.some(name=>courses.find(c=>c.name===name)?.terms.some(t=>t.year===y))) });
  }
  function completeMission(id){if(completed.includes(id))return;completed=[...completed,id];localStorage.setItem('ntou-ee-missions',JSON.stringify(completed));renderMissions()}
  function renderMissions(){
    $('#mission-progress').textContent=`${completed.length} / ${missions.length} 完成`;
    $('#mission-list').innerHTML=missions.map(m=>`<article class="mission-card ${completed.includes(m.id)?'done':''}"><span class="mission-check">${completed.includes(m.id)?'✓':'○'}</span><div><strong>${esc(m.title)}</strong><small>${esc(m.hint)}</small></div><button data-mission="${m.id}" ${completed.includes(m.id)?'disabled':''}>${completed.includes(m.id)?'完成':'開始 →'}</button></article>`).join('');
    document.querySelectorAll('[data-mission]').forEach(btn=>btn.addEventListener('click',()=>{const m=missions.find(x=>x.id===btn.dataset.mission);if(m.id==='foundation'){state.year=null;state.filter='全部';state.query='';$('#course-search').value='';state.selected=m.course;state.specialty=null;renderSpecialtyDetail(null);document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='全部'));renderCourses();$('#advisor-quote').textContent='先選微積分，再點選路線上的工程數學或電路學，看看基礎如何延伸。';$('#course-list').scrollIntoView({behavior:'smooth',block:'center'})}else if(m.id==='current')$('#specialty-grid').scrollIntoView({behavior:'smooth',block:'center'});else{state.year=null;state.query='';$('#course-search').value='';state.filter='核心課程';state.selected=null;state.specialty=null;renderSpecialtyDetail(null);document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='核心課程'));renderCourses();$('#course-list').scrollIntoView({behavior:'smooth',block:'center'})}}));
  }
  function renderStories(){
    $('#student-stories').innerHTML=studentStories.map((s,i)=>`<button class="story-card" data-story="${i}"><span class="story-year">大${s.year}</span><strong>${s.name}</strong><small>${s.mood}</small><span class="story-line">${s.line}</span></button>`).join('');
    document.querySelectorAll('.story-card').forEach(card=>card.addEventListener('click',()=>{const s=studentStories[+card.dataset.story];document.querySelectorAll('.story-card').forEach(x=>x.classList.toggle('active',x===card));$('#advisor-quote').textContent=s.line;$('#speak-btn').focus({preventScroll:true})}));
  }
  function renderSpecialtyDetail(s){
    const box=$('#specialty-detail');if(!s){box.classList.add('hidden');box.innerHTML='';return}
    const linked=courses.filter(c=>s.keys.some(k=>c.name.includes(k)));
    box.classList.remove('hidden');box.innerHTML=`<div class="specialty-detail-head"><div><span class="eyebrow">SPECIALTY EXPLORER</span><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p></div><button class="close-detail" aria-label="收合領域介紹">×</button></div><div class="specialty-courses"><strong>相關課程探索</strong><div>${linked.map(c=>`<button data-specialty-course="${esc(c.name)}">${esc(c.name)} <span>↗</span></button>`).join('')||'<span>請從課程搜尋探索相關課程。</span>'}</div></div><div class="project-examples"><strong>專題靈感示例</strong><span class="example-tag">非系上正式專題清單</span><ul>${s.projects.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
    box.querySelector('.close-detail').addEventListener('click',()=>renderSpecialtyDetail(null));
    box.querySelectorAll('[data-specialty-course]').forEach(btn=>btn.addEventListener('click',()=>{state.specialty=null;state.filter='全部';state.selected=btn.dataset.specialtyCourse;document.querySelectorAll('.specialty-card').forEach(x=>x.classList.remove('active'));renderCourses();$('#course-list').scrollIntoView({behavior:'smooth',block:'nearest'})}));
  }
  function tourStart(){state.tourStage=1;showYear(1);$('#tour-next').disabled=false;$('#tour-caption').textContent='第 1 站：打好數學、物理與程式基礎。';$('#advisor-quote').textContent='第一站，大一基礎工坊。微積分與普通物理讓你練習用數學描述變化、用實驗觀察現象；程式設計與交換電路和邏輯設計，則讓抽象的想法開始變成可以執行、可以檢驗的步驟。這些課程是學習旅程的起點，也會在之後的電路、訊號和系統課程中再次派上用場。'}
  function tourAdvance(){if(!state.tourStage){tourStart();return}if(state.tourStage>=4){state.tourStage=0;$('#tour-next').disabled=true;$('#tour-caption').textContent='導覽完成。接著可以自由探索島嶼。';$('#advisor-quote').textContent='四年旅程走完了。現在可以到六大領域看看，哪一條航線最吸引你。';return}state.tourStage++;showYear(state.tourStage);const lines={2:'第二站，大二電路研究所。電路學從大一下延續到大二上，附件也特別註明兩學期須依序修習；電子學與電子學實驗則跨越多個學期。工程數學、線性代數和電磁學提供分析工具，讓你逐步理解電路、元件與電磁現象之間的關係。這些是課程關聯圖呈現的學習脈絡，不代表每一門課都是正式先修條件。',3:'第三站，大三專業實驗室。你會在訊號與系統、機率學、電磁波、電子學等課程中接觸更專業的問題，也開始進行專題研究。六大領域入口可以幫你從資訊科技、電波、固態電子、電力與電子電路、控制、通訊與訊號處理等方向探索興趣。系訂必選課程的核心選擇與領域指定課程規則，請以附件科目表和系上說明為準。',4:'第四站，大四專題港。附件科目表把專題研究（Ⅱ）排在大四上；專題讓你把課堂工具放進一個具體問題裡，練習規劃、實作與說明成果。整體規劃列有必修總學分 110、選修最低 27，畢業最低 137 學分。你也可以到課程總覽查看各學期明細列的學分分布，再收藏有興趣的課程，整理自己的探索清單。'};$('#tour-caption').textContent=`第 ${state.tourStage} 站：${['','','連起數學與電機核心','試探專業領域','整合所學做專題'][state.tourStage]}。`;$('#advisor-quote').textContent=lines[state.tourStage]}
  function renderSpecialties(){
    $('#specialty-grid').innerHTML=specialty.map((s,i)=>`<button class="specialty-card" data-specialty="${i}"><span class="specialty-icon">${s.icon}</span><strong>${s.name}</strong><small>${s.subtitle}</small></button>`).join('');
    document.querySelectorAll('.specialty-card').forEach(btn=>btn.addEventListener('click',()=>{
      const s=specialty[+btn.dataset.specialty];state.specialty=state.specialty===s?null:s;state.year=null;state.selected=null;document.querySelectorAll('.year-node').forEach(n=>n.classList.remove('active'));document.querySelectorAll('.specialty-card').forEach(n=>n.classList.toggle('active',n===btn&&!!state.specialty));state.filter='全部';document.querySelectorAll('.filter-chip').forEach(n=>n.classList.toggle('active',n.dataset.filter==='全部'));renderCourses();renderSpecialtyDetail(state.specialty);if(state.specialty){completeMission('current');$('#advisor-quote').textContent=`${s.name}是六條專業航線之一。下面先整理可探索的相關課程，作為認識領域的起點；實際選課仍請參考科目表與系上規定。可以點擊課程查看課號和學期。`;document.querySelector('.detail-panel').scrollIntoView({behavior:'smooth',block:'nearest'})}else $('#advisor-quote').textContent=guide[state.guide];
    }));
  }
  function renderOverview(){
    const required=110, elective=27, gradMinimum=137, requiredShare=required/gradMinimum*100;
    $('#credit-composition').innerHTML=`<div class="composition-heading"><strong>畢業學分組成</strong><span>最低 ${gradMinimum} 學分</span></div><div class="composition-bar" role="img" aria-label="必修 ${required} 學分，選修至少 ${elective} 學分"><i style="width:${requiredShare}%"></i><i style="width:${100-requiredShare}%"></i></div><div class="composition-legend"><span><i></i>必修 <b>${required}</b> 學分・${requiredShare.toFixed(1)}%</span><span><i></i>選修至少 <b>${elective}</b> 學分・${(100-requiredShare).toFixed(1)}%</span></div><small>必修總學分含系訂必選修 15 學分。各人修課與抵免狀況可能不同。</small>`;
    const semesterCredits={};
    courses.forEach(c=>c.terms.forEach(t=>{const key=`${t.year}${t.semester}`;semesterCredits[key]=(semesterCredits[key]||0)+t.credits.split(',').reduce((sum,n)=>sum+Number(n),0)}));
    const chartItems=[1,2,3,4].flatMap(y=>['上','下'].map(s=>({label:`大${y}${s}`,value:semesterCredits[`${y}${s}`]||0})));
    $('#credit-chart').innerHTML=chartItems.map(x=>`<div class="chart-column"><span class="chart-value">${x.value}</span><div class="chart-track"><i style="--bar:${Math.round(x.value/24*100)}%"></i></div><small>${x.label}</small></div>`).join('');
    const semesterNames=['上學期','下學期'];
    $('#semester-board').innerHTML=[1,2,3,4].map(y=>{
      const desc=['基礎起航','理解電路與訊號','專業深化','專題整合'][y-1];
      const blocks=semesterNames.map((sem,si)=>{
        const items=courses.filter(c=>c.terms.some(t=>t.year===y&&t.semester===(si?'下':'上')));
        return `<div class="semester-block"><h4>${sem}</h4>${items.length?items.map(c=>`<div class="overview-course"><span>${esc(c.name)}</span><small>${c.credits} 學分</small></div>`).join(''):'<div class="overview-course"><span>依個人修課規劃</span><small>—</small></div>'}</div>`;
      }).join('');
      return `<section class="year-column"><h3>大${y}・${desc}</h3><p>第 ${y} 學年課程</p>${blocks}</section>`;
    }).join('');
  }
  function showYear(y){state.year=state.year===y?null:y;state.specialty=null;state.selected=null;state.filter='全部';renderSpecialtyDetail(null);document.querySelectorAll('.filter-chip').forEach(n=>n.classList.toggle('active',n.dataset.filter==='全部'));document.querySelectorAll('.year-node').forEach(n=>n.classList.toggle('active',+n.dataset.year===state.year));document.querySelectorAll('.specialty-card').forEach(n=>n.classList.remove('active'));renderCourses();$('#advisor-quote').textContent=state.year?`大${y}是「${['','工程基礎','電路與系統','專業深化','專題整合'][y]}」的重要階段。課程依照原表列出，點選課程可查看學分與修課備註。`:guide[state.guide]}
  document.querySelectorAll('.year-node').forEach(n=>n.addEventListener('click',()=>showYear(+n.dataset.year)));
  document.querySelectorAll('.filter-chip').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));renderCourses()}));
  $('#course-search').addEventListener('input',e=>{state.query=e.target.value;renderCourses()});
  window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#course-search').focus()}if(e.key==='Escape')$('#rules-modal').classList.add('hidden')});
  $('#next-guide').addEventListener('click',()=>{state.guide=(state.guide+1)%guide.length;$('#advisor-quote').textContent=guide[state.guide]});
  $('#chair-guide').addEventListener('click',()=>{state.guide=(state.guide+1)%guide.length;$('#advisor-quote').textContent=guide[state.guide]});
  $('#speak-btn').addEventListener('click',()=>{if(!('speechSynthesis'in window)){return}speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance($('#advisor-quote').textContent))});
  $('#sound-toggle').addEventListener('click',e=>{if(!('speechSynthesis'in window))return;if(speechSynthesis.speaking){speechSynthesis.cancel();e.currentTarget.textContent='♫'}else{speechSynthesis.speak(new SpeechSynthesisUtterance($('#advisor-quote').textContent));e.currentTarget.textContent='■'}});
  $('#reset-map').addEventListener('click',()=>{state={year:null,filter:'全部',query:'',selected:null,specialty:null,guide:0,tourStage:0};$('#course-search').value='';document.querySelectorAll('.year-node,.specialty-card,.story-card').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x.dataset.filter==='全部'));renderSpecialtyDetail(null);$('#tour-next').disabled=true;$('#tour-caption').textContent='跟著系主任，沿年級走一遍學習路線。';$('#advisor-quote').textContent=guide[0];renderCourses()});
  const modal=$('#rules-modal');$('#rules-open').addEventListener('click',()=>modal.classList.remove('hidden'));modal.addEventListener('click',e=>{if(e.target.dataset.close)modal.classList.add('hidden')});
  const islandView=$('#island-view'), overview=$('#overview-view');
  function setView(v){const isOverview=v==='overview';islandView.classList.toggle('hidden',isOverview);$('.detail-panel').classList.toggle('hidden',isOverview);overview.classList.toggle('hidden',!isOverview);document.querySelectorAll('.nav-btn').forEach(n=>n.classList.toggle('active',n.dataset.view===v));if(isOverview)renderOverview();window.scrollTo({top:0,behavior:'smooth'})}
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));$('#back-island').addEventListener('click',()=>setView('island'));
  $('#tour-start').addEventListener('click',tourStart);$('#tour-next').addEventListener('click',tourAdvance);$('#route-clear').addEventListener('click',()=>{state.selected=null;renderCourses()});
  renderSpecialties();renderStories();renderMissions();renderFavorites();renderCourses();
})();
