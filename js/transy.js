/*页面层(transy.html)*********************************************************************************//**  *  * * @method  * @param {}  * @param {}  * @return {}  */function ArticleList(articleList, articleNumberPerPage){	//初始化文章条目集合	this.articleList = articleList;		//初始化每页显示的文章条目数	this.articleNum = articleNumberPerPage;		//ArticleList对象方法	if(typeof this.getPageCount != "function"){						//文章条目是否为零		ArticleList.prototype.isEmpty = function(){			return (this.articleList.length == 0);		}				//返回页面总数		ArticleList.prototype.getPageCount = function(){			return Math.floor((this.articleList.length + this.articleNum - 1) / this.articleNum);		}			//获取文章条目数		ArticleList.prototype.getLength = function(){			return this.articleList.length;		}			//获取指定页数的文章条目集合		ArticleList.prototype.getArticleList = function(pageNum){			if(pageNum > this.getPageCount()){				return;			}			var list = [];			var startIndex = (pageNum - 1) * this.articleNum;			var endIndex = (pageNum * this.articleNum < this.articleList.length)? (pageNum * this.articleNum) : this.articleList.length;			for(var i=startIndex; i<endIndex; i++){				list.push(this.articleList[i]);			}			return list;		}				//对文章集合按创建时间排序		ArticleList.prototype.sortArticle = function(){			//选择排序法			for(var i=0; i<this.articleList.length-1; i++){				var max = i,					temp = null;				//找出每一遍排序中最大项的位置				for(var j=i+1; j<this.articleList.length; j++){					if(parseInt(this.articleList[j].createTime) > parseInt(this.articleList[max].createTime)){						max = j;					}				}							//交换首项和最大项的位置				if(max != i){					temp = this.articleList[i];					this.articleList[i] = this.articleList[max];					this.articleList[max] = temp;				}				}		}				//返回列表中的首篇文章		ArticleList.prototype.getFirstArticle = function(){			return this.articleList[0].enTitle;		}				//添加文章条目		ArticleList.prototype.addArticle = function(article){			//增加文章条目			this.articleList.unshift({				"enTitle":article.enTitle,				"createTime":article.createTime,				"url":article.url,				"complete":article.complete			});		}				//删除文章条目		ArticleList.prototype.removeArticle = function(enTitle){			//删除对应的文章条目			for(var i=0; i<this.articleList.length; i++){				if(this.articleList[i].enTitle == enTitle){					this.articleList.splice(i, 1);					return;				}			}		}				//获取最后编辑的文章标题		ArticleList.prototype.getLastEditArticleTitle = function(){			var last = 0;			for(var i=1; i<this.articleList.length; i++){				if(parseInt(this.articleList[i].lastEditTime) > parseInt(this.articleList[last].lastEditTime)){					last = i;				}			}						return this.articleList[last].enTitle;		}	}		this.sortArticle();}/**  * Create the list of the articles. * * @method createArticleList * @param  {Int} page - The page number of the article list.    * @return {none}  */function createArticleList() {	//获取ul列表	var ulList = document.getElementById("articleList");	ulList.innerHTML = "";		var articles = GLOBAL.articleList.getArticleList(GLOBAL.pageNumber);		//插入文章条目	for(var i=0; i<articles.length; i++){ 		//获取文章数据		var article = articles[i];				//创建列表项		var li = document.createElement("li"); 		if(i == (articles.length - 1)){			li.id = "articleList-last";		}		 		//标题		var title = document.createElement("span");		title.innerHTML = article.enTitle;		title.className = "article-title";		title.onclick = function(){			GLOBAL.currentArticleTitle = this.innerHTML;			showArticle("EN/CN");		}		li.appendChild(title);				//创建进度条  		//if(article.complete != 0){			var comp = document.createElement("span");			comp.className = "article-complete";			/* comp.style.width = article.complete + "%" */			comp.style.backgroundPositionX = -200 + article.complete * 2 + "px";			li.appendChild(comp);		//} 			 		//最后更新时间		var time = document.createElement("span");		time.className = "article-createTime";		var createDate = new Date(parseInt(article.createTime));		time.innerHTML = createDate.getFullYear() + "/" + (createDate.getMonth() + 1) + "/" + createDate.getDate();		li.appendChild(time);				//删除按钮		var del = document.createElement("a");		del.className = "article-deleteBtn";		del.onclick = function(){			var enTitle = this.parentNode.getElementsByClassName("article-title")[0].innerHTML;					var sure = confirm("确认删除 " + enTitle + " 吗？"); 			if(sure){				//移入回收站				var item = this.parentNode;				try{					deleteDataItem("Article", enTitle);				} catch(err) {}							//更新内存中的文章集合数据				GLOBAL.articleList.removeArticle(enTitle);								//若待删除文章为当前显示文章，则刷新页面				if(GLOBAL.currentArticleTitle == enTitle){					window.location = "transy.html";				} else {					//更新文章列表					createArticleList();				}			}		} 		var delIcon = document.createElement("img");		delIcon.src = "images/bin.png";		delIcon.title = "删除";		del.appendChild(delIcon);		li.appendChild(del);				//显示原文按钮		if(article.url){			//指向原文的超链接			var original = document.createElement("a");			original.className = "article-original";			original.target = "_target";			original.href = article.url;						//按钮图标			var originalIcon = document.createElement("img");			originalIcon.src = "images/doc.png";			originalIcon.title = "原文";			original.appendChild(originalIcon);			li.appendChild(original);		}						//加入DOM文档 		li.onmouseover = function(){			var del = this.getElementsByClassName("article-deleteBtn")[0];			del.style.display = "inline-block";			var original = this.getElementsByClassName("article-original")[0];			if(original){				original.style.display = "inline-block";			}		}		li.onmouseout = function(){			var del = this.getElementsByClassName("article-deleteBtn")[0];			del.style.display = "none";							var original = this.getElementsByClassName("article-original")[0];			if(original){				original.style.display = "none";			}					} 		ulList.appendChild(li); 	}}/**  * Turn to the previous page of the article list. * * @method handlePageLeft * @param {none}  * @return {none}  */function handlePageLeft(){	//若为起始页，则不翻页	if(GLOBAL.pageNumber == 1){		return;	} else {		//翻页		GLOBAL.pageNumber--;		createArticleList();		//设置当前页数		var currentPageNumber = document.getElementById("pager-currentNum");		currentPageNumber.innerHTML = GLOBAL.pageNumber;	}}/**  * Turn to the next page of the article list. * * @method handlePageRight * @param {none}  * @return {none}  */function handlePageRight(){	//若为尾页，则不翻页	if(GLOBAL.pageNumber == GLOBAL.articleList.getPageCount()){		return;	} else {		//翻页		GLOBAL.pageNumber++;		createArticleList();			//设置当前页数		var currentPageNumber = document.getElementById("pager-currentNum");		currentPageNumber.innerHTML = GLOBAL.pageNumber;	}}/**  * Display the article in the article area. * * @method showArticle * @param {String} format - The format of the article.   * @return {none}  */function showArticle(format){	//隐藏新建文章区域	var newArticle = document.getElementById("newArticle");	newArticle.style.display = "none";						//生成文章	var article = JSON.parse(getDataItem("Article", GLOBAL.currentArticleTitle));			var articleArea = document.getElementById("articleArea");	articleArea.style.display = "block";	articleArea.innerHTML = getArticleOutput(format, article);		//生成ul列表	var nodes = articleArea.childNodes;	var nodesArray = Array.prototype.slice.call(nodes, 0);	for(var j=0; j<nodesArray.length; j++){		//创建ul父节点		var list = document.createElement("ul");		list.className = "transy-list";				//使用ul标签包围li		var range = document.createRange();		if(nodesArray[j].nodeName == "LI"){			range.setStartBefore(nodesArray[j]);			while(++j){				if(j == nodesArray.length){					range.setEndAfter(nodesArray[j]);					range.surroundContents(list);					return;				} else if(nodesArray[j].nodeName != "LI"){					range.setEndBefore(nodesArray[j]);					range.surroundContents(list);					break;				} else {					continue;				}			}		}	}		//设置注解	var sups = articleArea.getElementsByTagName("mark");	var supsArray = Array.prototype.slice.call(sups, 0);	for(var i=0; i<supsArray.length; i++){		var comment = document.createElement("span");		comment.className = "transy-comment";		comment.innerHTML = "（" + article.commentList[i] + " —— 译者注）";		supsArray[i].parentNode.replaceChild(comment, supsArray[i]);	}		//设置格式选项	setSelectIndex(format);		//启用相关功能按键	document.getElementById("articleFormat").disabled = false;	document.getElementById("edit").disabled = false;		//设置翻译页面url	var translationPage = document.getElementById("translationPage");	translationPage.src = setUrlString("article.html", {"title":GLOBAL.currentArticleTitle });}/**  * Set the "articleFormat" select's index. * * @method setSelectIndex * @param {String} format - the format of the article to display.  * @return {none}  */function setSelectIndex(format){	var articleFormat = document.getElementById("articleFormat");	switch(format){		case "EN/CN":			articleFormat.selectedIndex = 0;			break;		case "EN":			articleFormat.selectedIndex = 1;			break;		case "CN":			articleFormat.selectedIndex = 2;			break;	}}/**  * Get the corresponding HTML tags. * * @method getHTMLOutput * @param {String} type - The type of the item. * @param {String} content - The content of the item.  * @return {String} HTML tags.  */function getHtmlString(type, content){	//返回对应类型的 HTML tag 代码	switch(type){		case GLOBAL.itemType.PARA:			return "<p class='transy-para'>" + content + "</p>"						case GLOBAL.itemType.MAINHEAD:			return "<h3 class='transy-mainHead'>" + content + "</h3>"		case GLOBAL.itemType.SUBHEAD:			return "<h4 class='transy-subHead'>" + content + "</h4>"		case GLOBAL.itemType.QUOTE:			return "<blockquote class='transy-quote'>" + content + "</blockquote>"		case GLOBAL.itemType.CODE:			return "<pre class='transy-code'>" + content + "</pre>"				case GLOBAL.itemType.IMAGE:			return "<img class='transy-image' src='" + content + "'/>"		case GLOBAL.itemType.LIST:			return "<li>" + content + "</li>"	}}/**  * Get the HTML string of the article. * * @method getArticleOutput * @param {String} mode - The output mode. * @param {Object} article - The data of the article.   * @return {String} the HTML string of the article. */function getArticleOutput(mode, article){	var str = "";	switch(mode){		//英文		case "EN":			//英文标题			str += "<h2 id='enTitle'>" + article.enTitle + "</h2>";			str += "<p id='link'>[原文链接] <a href='" + article.url + "' target='_black'>" + article.url +"</a></p>";			//英文段落			for(var i=0; i<article.itemList.length; i++){				str += getHtmlString(article.itemList[i].itemType, article.itemList[i].enItem);			}			break;					//中文		case "CN":			//中文标题			if(article.cnTitle != ""){				str += "<h2 id='cnTitle'>" + article.cnTitle + "</h2>";			}			str += "<p id='link'>[原文链接] <a href='" + article.url + "' target='_black'>" + article.url +"</a></p>";			//中文段落			for(var i=0; i<article.itemList.length; i++){				if(article.itemList[i].cnItem != ""){					str += getHtmlString(article.itemList[i].itemType, article.itemList[i].cnItem);				}			}			//注释			if(article.commentList.length != 0){				str += "<h3>注解：</h3>"				for(var j=0; j<article.commentList.length; j++){					str += ("<p>[" + (j + 1) + "] " + article.commentList[j] + "</p>");				}			}			break;						//中英混排		case "EN/CN":			//中英标题			str += "<h2 id='enTitle'>" + article.enTitle + "</h2>";			if(article.cnTitle != ""){				str += "<h2 id='cnTitle'>" + article.cnTitle + "</h2>";			}			str += "<p id='link'>[原文链接] <a href='" + article.url + "' target='_black'>" + article.url +"</a></p>";			//中英段落			for(var i=0; i<article.itemList.length; i++){				switch(article.itemList[i].itemType){					//标题和正文分开显示					case GLOBAL.itemType.MAINHEAD:					case GLOBAL.itemType.SUBHEAD:					case GLOBAL.itemType.PARA:					case GLOBAL.itemType.LIST:						str += getHtmlString(article.itemList[i].itemType, article.itemList[i].enItem);							if(article.itemList[i].cnItem != ""){							str += getHtmlString(article.itemList[i].itemType, article.itemList[i].cnItem);							}						break;					//中英引语合并					case GLOBAL.itemType.QUOTE:						str += getHtmlString(article.itemList[i].itemType, article.itemList[i].enItem + "<br/>" + article.itemList[i].cnItem);						break;					//图片和代码仅显示一次					case GLOBAL.itemType.IMAGE:					case GLOBAL.itemType.CODE:						str += getHtmlString(article.itemList[i].itemType, article.itemList[i].enItem);						break;				}					}			break;	}	return str;}/** * Create a new article to be translated. * * @method createNewArticle * @param {String} title - The title of the English article. * @param {String} body - The body of the English article. * @return none */function createNewArticle(title, body, url){	//创建 JSON 对象	var article = {};		//保存中、英标题、原文url地址	article.enTitle = title;	article.cnTitle = "";	article.url = url;		//初始化完成度		article.complete = "0";		//保存创建时间和最新更新时间	article.createTime = article.lastEditTime = (new Date()).getTime();		//保存英文原文段落，初始化中文段落和段落类型	var itemList = [];	paras = body.split('\n');	for(var i=0,j=0; i<paras.length; i++){		//判断是否为空		paras[i] = jQuery.trim(paras[i]);		if(paras[i].length == 0){			continue;		}		//构建数据结构		itemList.push({			"enItem":paras[i],			"cnItem":"",			"itemType":GLOBAL.itemType.PARA,			"tranState":GLOBAL.translationState.UNDO 		});	}	article.itemList = itemList;		//注解	article.commentList = [];			//保存新数据	var str = JSON.stringify(article);	addDataItem("Article", article.enTitle, str);		//更新内存中的文章列表	GLOBAL.articleList.addArticle(article);}/**  * To change the format of the article. * * @method handleArticleFormatChange * @param {none}  * @return {none}  */function handleArticleFormatChange(){	//切换文章格式	showArticle(this.options[this.selectedIndex].value);}/**  * Display the form to input the article's title and content. * * @method handleNewArticle * @param {none}  * @return {none}  */function handleNewArticle(){	//隐藏文章区域	var articleArea = document.getElementById("articleArea");	articleArea.style.display = "none";		//禁用相关功能按键	document.getElementById("articleFormat").disabled = true;	document.getElementById("edit").disabled = true;		//显示新建文章区域	var newArticle = document.getElementById("newArticle");	newArticle.style.display = "block";}/**  * Link to the translation page. * * @method handleEditArticle * @param {none}  * @return {none}  */function handleEditArticle(){			//显示翻译页面	showTranslationPage();}/**  * Show the translation page. * * @method showTranslationPage * @param {none}  * @return {none}  */function showTranslationPage(){	//隐藏主页面的滚动条	document.body.style.overflow = "hidden";		//显示翻译页面	var translationPage = document.getElementById("translationPage");	translationPage.style.display = "block";}/**  * Hide the translation page and update the article data of the main page. * * @method hideTranslationPage * @param {none}  * @return {none}  */function hideTranslationPage(){	//隐藏翻译页面	var translationPage = document.getElementById("translationPage");	translationPage.style.display = "none";		//显示主页面的滚动条	document.body.style.overflow = "auto";		//更新文章内容	showArticle("EN/CN");}/**  * Create a new article to be translated. * * @method handleNewArticle * @param {none}  * @return {none}  */function handleCreateNewArticle(){	//获取标题和正文	var enTitle = jQuery.trim($("#newArticleTitle").val());	var article = document.getElementById("newArticleContent");	var url = jQuery.trim($("#newArticleUrl").val());	var enBody = jQuery.trim(article.value);		//若有任何一项为空，则显示提示信息	var notice = document.getElementById("notice");	if(enTitle == "" || enBody == "" || url == "") {		$("#notice").text("标题、正文或原文地址不能为空！");		notice.style.display = "block";		setTimeout("$('#notice').fadeOut('slow')", 1200);		return;	} else if(isDataItemExist("Article", enTitle)) {		$("#notice").text("此标题已存在！");		notice.style.display = "block";		setTimeout("$('#notice').fadeOut('slow')", 1200);		return;	}		//创建新的文章条目，并保存	createNewArticle(enTitle, enBody, url);		//清空表单文本	document.getElementById("newArticleTitle").value = "";	document.getElementById("newArticleContent").value = "";	document.getElementById("newArticleUrl").value = "";			//刷新文章列表	GLOBAL.pageNumber = 1;	createArticleList();			//显示此文	GLOBAL.currentArticleTitle = enTitle;	showArticle("EN");}/**  * Return to the article page. * * @method handleReturnToArticlePage * @param {none}  * @return {none}  */function handleReturnToArticlePage(){	//清空表单文本	document.getElementById("newArticleTitle").value = "";	document.getElementById("newArticleContent").value = "";	document.getElementById("newArticleUrl").value = "";		//隐藏新建文章区	var newArticle = document.getElementById("newArticle");	newArticle.style.display = "none";		//显示文章区域	var articleArea = document.getElementById("articleArea");	articleArea.style.display = "block";	if(articleArea.innerHTML != ""){		//启用相关功能按键		document.getElementById("articleFormat").disabled = false;		document.getElementById("edit").disabled = false;	}}