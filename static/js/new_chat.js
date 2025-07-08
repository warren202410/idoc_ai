// iDOC 高级智能Agent聊天系统
document.addEventListener('DOMContentLoaded', function() {
    // 核心DOM元素
    const chatBody = document.querySelector('.chat-body');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.message-send-btn');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const contextBar = document.getElementById('context-bar');
    const suggestionToggleBtn = document.getElementById('suggestion-toggle-btn');
    const contextToggleBtn = document.getElementById('context-toggle-btn');
    const autocompleteContainer = document.getElementById('autocomplete-container');

    // 初始化状态
    let conversationContext = [];
    let lastMessageType = null;
    let chatStarted = false;
    
    // 文档状态跟踪
    const activeDocuments = [
        { 
            id: 'doc-contract-123', 
            name: '采购合同2025-XC35', 
            type: 'contract', 
            icon: 'file-contract',
            lastModified: new Date()
        },
        { 
            id: 'doc-financial-456', 
            name: '财务报表Q2', 
            type: 'financial', 
            icon: 'file-invoice-dollar',
            lastModified: new Date(Date.now() - 86400000) // 昨天
        }
    ];
    
    // 聊天初始化
    function initChat() {
        if (!chatBody || !messageInput || !sendButton) return;
        
        // 智能建议切换
        if (suggestionToggleBtn && suggestionsContainer) {
            suggestionToggleBtn.addEventListener('click', function() {
                toggleElement(suggestionsContainer);
                this.classList.toggle('active');
            });
            
            // 默认显示智能建议
            setTimeout(() => {
                if(suggestionsContainer.style.display !== 'block') {
                    suggestionsContainer.style.display = 'block';
                    suggestionToggleBtn.classList.add('active');
                }
            }, 1500);
        }
        
        // 上下文切换
        if (contextToggleBtn && contextBar) {
            contextToggleBtn.addEventListener('click', function() {
                toggleElement(contextBar);
                this.classList.toggle('active');
            });
        }
        
        // 初始化输入事件
        initInputEvents();
        
        // 初始化智能建议点击事件
        initSuggestionEvents();
        
        // 显示主动问候
        setTimeout(showProactiveGreeting, 800);
    }
    
    // 初始化输入事件
    function initInputEvents() {
        // 自适应高度
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            // 自动完成提示
            const query = this.value.trim();
            if (query.length > 2) {
                showAutocomplete(query);
            } else {
                hideAutocomplete();
            }
        });
        
        // 提交消息处理
        sendButton.addEventListener('click', submitUserMessage);
        
        // 快捷键: Enter发送，Shift+Enter换行
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitUserMessage();
            }
        });
    }
    
    // 初始化建议点击事件
    function initSuggestionEvents() {
        const suggestionPills = document.querySelectorAll('.suggestion-pill');
        suggestionPills.forEach(pill => {
            pill.addEventListener('click', function() {
                messageInput.value = this.textContent;
                messageInput.focus();
                messageInput.dispatchEvent(new Event('input'));
                
                // 自动收起建议面板
                setTimeout(() => {
                    if (suggestionsContainer.style.display === 'block') {
                        suggestionsContainer.style.display = 'none';
                        if (suggestionToggleBtn) suggestionToggleBtn.classList.remove('active');
                    }
                }, 200);
            });
        });
    }
    
    // 显示主动问候
    function showProactiveGreeting() {
        if (!chatBody || chatStarted) return;
        
        chatStarted = true;
        
        // 初始显示AI正在输入
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            
            // 生成问候消息
            const now = new Date();
            const welcomeMessage = createAIMessage({
                content: `
                    <div class="ai-greeting">
                        <p>您好！我是您的<strong>iDOC</strong>智能助理。通过自然语言，我可以帮助您完成各种文档相关任务。</p>
                        
                        <div class="ai-capabilities-section">
                            <p class="capabilities-title"><i class="fas fa-brain text-primary me-2"></i>我能做什么：</p>
                            <div class="capabilities-grid">
                                <div class="capability-item">
                                    <i class="fas fa-file-contract text-primary"></i>
                                    <span>合同分析</span>
                                </div>
                                <div class="capability-item">
                                    <i class="fas fa-chart-line text-primary"></i>
                                    <span>财务报表解读</span>
                                </div>
                                <div class="capability-item">
                                    <i class="fas fa-tasks text-primary"></i>
                                    <span>风险评估</span>
                                </div>
                                <div class="capability-item">
                                    <i class="fas fa-file-alt text-primary"></i>
                                    <span>文档摘要</span>
                                </div>
                                <div class="capability-item">
                                    <i class="fas fa-search text-primary"></i>
                                    <span>信息提取</span>
                                </div>
                                <div class="capability-item">
                                    <i class="fas fa-exchange-alt text-primary"></i>
                                    <span>文档对比</span>
                                </div>
                            </div>
                        </div>
                        
                        <p>我注意到您最近上传了<span class="doc-badge" data-doc-id="doc-contract-123">采购合同2025-XC35</span>，我可以帮您分析其中的关键条款和潜在风险。</p>
                        
                        <p>请问今天需要我帮您做什么？</p>
                    </div>
                `,
                timestamp: now
            });
            
            chatBody.appendChild(welcomeMessage);
            scrollToBottom();
            
            // 显示文档上下文参考
            setTimeout(() => {
                updateContextDocuments(activeDocuments);
                if (contextBar && contextBar.style.display !== 'block') {
                    contextBar.style.display = 'block';
                    if (contextToggleBtn) contextToggleBtn.classList.add('active');
                }
            }, 500);
            
            // 智能推荐第一个任务
            setTimeout(() => {
                const proactiveMessage = createAIMessage({
                    content: `
                        <div class="ai-proactive-suggestion">
                            <p>这是一个好的开始：我可以先帮您分析<span class="doc-badge" data-doc-id="doc-contract-123">采购合同2025-XC35</span>中的主要风险点。点击下方按钮开始分析：</p>
                            
                            <div class="action-buttons">
                                <button class="action-button primary" onclick="selectAction('帮我分析采购合同中的主要风险点')">
                                    <i class="fas fa-shield-alt"></i>
                                    分析合同风险
                                </button>
                                <button class="action-button" onclick="selectAction('提取合同中的关键日期和时间节点')">
                                    <i class="fas fa-calendar-alt"></i>
                                    提取关键日期
                                </button>
                                <button class="action-button" onclick="selectAction('总结合同主要条款')">
                                    <i class="fas fa-list-alt"></i>
                                    总结主要条款
                                </button>
                            </div>
                        </div>
                    `,
                    timestamp: now,
                    isProactive: true
                });
                
                chatBody.appendChild(proactiveMessage);
                scrollToBottom();
                
                // 绑定动作按钮事件
                document.querySelectorAll('.action-button').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const action = this.getAttribute('onclick').match(/'(.*?)'/)[1];
                        window.selectAction(action);
                    });
                });
            }, 2000);
        }, 1500);
    }
    
    // 提交用户消息
    function submitUserMessage() {
        if (!messageInput || !chatBody) return;
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        // 获取当前时间
        const now = new Date();
        
        // 添加用户消息
        const userMessageElement = createUserMessage({
            content: message,
            timestamp: now
        });
        chatBody.appendChild(userMessageElement);
        
        // 更新上下文
        conversationContext.push({
            role: 'user',
            content: message,
            timestamp: now
        });
        
        // 清除输入
        messageInput.value = '';
        messageInput.style.height = 'auto';
        hideAutocomplete();
        scrollToBottom();
        
        // 显示AI输入指示
        showTypingIndicator();
        
        // 生成AI响应
        generateAIResponse(message);
    }
    
    // 生成AI响应
    function generateAIResponse(userMessage) {
        // 模拟网络延迟
        const responseDelay = 1500 + Math.random() * 1000;
        
        setTimeout(() => {
            removeTypingIndicator();
            
            // 当前时间
            const now = new Date();
            
            // 基于用户消息类型生成适当响应
            let aiResponseContent = '';
            let messageType = detectMessageType(userMessage);
            let followUpActions = [];
            
            // 根据消息类型生成不同响应
            switch(messageType) {
                case 'contract_analysis':
                    aiResponseContent = generateContractAnalysisResponse();
                    followUpActions = [
                        '帮我修改这些问题条款',
                        '这份合同与去年的对比有何不同',
                        '提取所有付款条件'
                    ];
                    break;
                    
                case 'financial_analysis':
                    aiResponseContent = generateFinancialAnalysisResponse();
                    followUpActions = [
                        '分析我们的盈利趋势',
                        '与行业基准对比',
                        '识别成本优化机会'
                    ];
                    break;
                    
                case 'document_comparison':
                    aiResponseContent = generateDocumentComparisonResponse();
                    followUpActions = [
                        '高亮显示关键差异',
                        '生成变更摘要报告',
                        '合并两个文档最好的部分'
                    ];
                    break;
                    
                case 'risk_assessment':
                    aiResponseContent = generateRiskAssessmentResponse();
                    followUpActions = [
                        '为每个风险提供缓解建议',
                        '生成风险评估报告',
                        '创建风险监控计划'
                    ];
                    break;
                    
                case 'document_summary':
                    aiResponseContent = generateDocumentSummaryResponse();
                    followUpActions = [
                        '提供更详细的章节摘要',
                        '提取主要观点和结论',
                        '标记关键行动项'
                    ];
                    break;
                    
                default:
                    aiResponseContent = generateGeneralResponse();
                    followUpActions = [
                        '分析采购合同',
                        '总结财务报表',
                        '提取关键信息'
                    ];
            }
            
            // 创建AI响应元素
            const aiResponseElement = createAIMessage({
                content: aiResponseContent,
                timestamp: now
            });
            
            chatBody.appendChild(aiResponseElement);
            scrollToBottom();
            
            // 更新上下文
            conversationContext.push({
                role: 'assistant',
                content: aiResponseContent,
                timestamp: now,
                type: messageType
            });
            
            lastMessageType = messageType;
            
            // 更新推荐的后续操作
            setTimeout(() => {
                updateSmartSuggestions(followUpActions);
                
                // 显示建议面板
                if (suggestionsContainer && suggestionsContainer.style.display !== 'block') {
                    suggestionsContainer.style.display = 'block';
                    if (suggestionToggleBtn) suggestionToggleBtn.classList.add('active');
                }
            }, 500);
            
            // 提供额外的主动建议 (特定情况下)
            if (messageType === 'contract_analysis' || messageType === 'risk_assessment') {
                setTimeout(() => {
                    const proactiveFollowUp = createAIMessage({
                        content: `
                            <div class="ai-proactive-suggestion">
                                <p>我注意到您对<span class="doc-badge" data-doc-id="doc-contract-123">采购合同</span>的关注。您可能还需要：</p>
                                
                                <div class="action-buttons">
                                    <button class="action-button" onclick="selectAction('生成法律合规检查报告')">
                                        <i class="fas fa-gavel"></i>
                                        法律合规检查
                                    </button>
                                    <button class="action-button" onclick="selectAction('对比以往类似合同条款')">
                                        <i class="fas fa-clone"></i>
                                        历史合同对比
                                    </button>
                                </div>
                            </div>
                        `,
                        timestamp: new Date(),
                        isProactive: true
                    });
                    
                    chatBody.appendChild(proactiveFollowUp);
                    scrollToBottom();
                    
                    // 重新绑定动作按钮
                    document.querySelectorAll('.action-button').forEach(btn => {
                        if (!btn.hasAttribute('data-initialized')) {
                            btn.setAttribute('data-initialized', 'true');
                            btn.addEventListener('click', function() {
                                const action = this.getAttribute('onclick').match(/'(.*?)'/)[1];
                                window.selectAction(action);
                            });
                        }
                    });
                }, 3000);
            }
        }, responseDelay);
    }
    
    // 创建用户消息元素
    function createUserMessage({content, timestamp}) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-user';
        
        const formattedTime = formatTime(timestamp);
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <div class="message-sender">您</div>
                    <div class="message-time">${formattedTime}</div>
                </div>
                <div class="message-body">
                    <p>${content}</p>
                </div>
            </div>
            <div class="message-avatar">
                <div class="message-avatar-placeholder">
                    您
                </div>
            </div>
        `;
        
        return messageElement;
    }
    
    // 创建AI消息元素
    function createAIMessage({content, timestamp, isProactive = false}) {
        const messageElement = document.createElement('div');
        messageElement.className = isProactive ? 'message message-proactive' : 'message';
        
        const formattedTime = formatTime(timestamp);
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <div class="message-avatar-placeholder">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <div class="message-sender">iDOC 智能助手</div>
                    <div class="message-time">${formattedTime}</div>
                </div>
                <div class="message-body">
                    ${content}
                </div>
            </div>
        `;
        
        return messageElement;
    }
    
    // 显示AI输入指示器
    function showTypingIndicator() {
        if (!chatBody) return;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message typing-message';
        typingElement.innerHTML = `
            <div class="message-avatar">
                <div class="message-avatar-placeholder">
                    <i class="fas fa-robot"></i>
                </div>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatBody.appendChild(typingElement);
        scrollToBottom();
    }
    
    // 移除AI输入指示器
    function removeTypingIndicator() {
        const typingMessages = document.querySelectorAll('.typing-message');
        typingMessages.forEach(msg => msg.remove());
    }
    
    // 检测消息类型
    function detectMessageType(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('合同') || lowerMessage.includes('协议') || lowerMessage.includes('条款') || lowerMessage.includes('法律')) {
            return 'contract_analysis';
        } else if (lowerMessage.includes('财务') || lowerMessage.includes('报表') || lowerMessage.includes('成本') || lowerMessage.includes('预算')) {
            return 'financial_analysis';
        } else if (lowerMessage.includes('比较') || lowerMessage.includes('对比') || lowerMessage.includes('差异')) {
            return 'document_comparison';
        } else if (lowerMessage.includes('风险') || lowerMessage.includes('问题') || lowerMessage.includes('隐患')) {
            return 'risk_assessment';
        } else if (lowerMessage.includes('摘要') || lowerMessage.includes('总结') || lowerMessage.includes('概括')) {
            return 'document_summary';
        } else {
            return 'general';
        }
    }
    
    // 更新智能建议
    function updateSmartSuggestions(suggestions) {
        if (!suggestionsContainer) return;
        
        const suggestionsListElement = suggestionsContainer.querySelector('.smart-suggestions-list');
        if (!suggestionsListElement) return;
        
        // 清除现有建议
        suggestionsListElement.innerHTML = '';
        
        // 添加新建议
        suggestions.forEach(suggestion => {
            const pill = document.createElement('button');
            pill.className = 'suggestion-pill';
            pill.textContent = suggestion;
            pill.addEventListener('click', function() {
                messageInput.value = this.textContent;
                messageInput.focus();
                messageInput.dispatchEvent(new Event('input'));
                
                // 自动收起建议面板
                setTimeout(() => {
                    if (suggestionsContainer.style.display === 'block') {
                        suggestionsContainer.style.display = 'none';
                        if (suggestionToggleBtn) suggestionToggleBtn.classList.remove('active');
                    }
                }, 200);
            });
            
            suggestionsListElement.appendChild(pill);
        });
    }
    
    // 更新上下文文档
    function updateContextDocuments(documents) {
        if (!contextBar) return;
        
        const contexDocumentsElement = contextBar.querySelector('.context-documents');
        if (!contexDocumentsElement) return;
        
        // 清除现有文档
        contexDocumentsElement.innerHTML = '';
        
        // 添加文档
        documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'context-document';
            docElement.innerHTML = `
                <i class="fas fa-${doc.icon}"></i>
                <span>${doc.name}</span>
            `;
            
            docElement.addEventListener('click', function() {
                // 模拟点击文档
                console.log(`Clicked document: ${doc.name}`);
                // 实际应用中可能会显示文档预览等
            });
            
            contexDocumentsElement.appendChild(docElement);
        });
    }
    
    // 自动完成建议
    function showAutocomplete(query) {
        if (!autocompleteContainer) return;
        
        // 基于消息类型提供不同建议
        let suggestions = [];
        
        if (lastMessageType === 'contract_analysis') {
            suggestions = [
                '这份合同中有哪些风险条款？',
                '帮我分析付款条件是否合理',
                '违约责任部分是否对我方有利？',
                '知识产权条款需要修改吗？',
                '交付时间条款是否存在风险？'
            ];
        } else if (lastMessageType === 'financial_analysis') {
            suggestions = [
                '这份财务报表有什么异常？',
                '我们的利润率趋势如何？',
                '哪些成本项目有优化空间？',
                '与上季度相比有什么变化？',
                '现金流状况如何？'
            ];
        } else if (lastMessageType === 'risk_assessment') {
            suggestions = [
                '这个项目的主要风险是什么？',
                '如何降低合规风险？',
                '对供应链风险的评估',
                '财务风险有哪些？',
                '提供风险缓解建议'
            ];
        } else {
            suggestions = [
                '分析这份文档的主要内容',
                '总结这份报告的关键点',
                '提取所有重要日期',
                '对比这两份文档的差异',
                '找出文档中的风险点'
            ];
        }
        
        // 查找匹配项
        const matches = suggestions.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        );
        
        if (matches.length > 0) {
            let html = '';
            matches.forEach(item => {
                html += `<div class="autocomplete-item">${item}</div>`;
            });
            
            autocompleteContainer.innerHTML = html;
            autocompleteContainer.classList.add('show');
            
            // 绑定点击事件
            const items = document.querySelectorAll('.autocomplete-item');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    messageInput.value = this.textContent;
                    hideAutocomplete();
                    messageInput.focus();
                });
            });
        } else {
            hideAutocomplete();
        }
    }
    
    // 隐藏自动完成
    function hideAutocomplete() {
        if (autocompleteContainer) {
            autocompleteContainer.innerHTML = '';
            autocompleteContainer.classList.remove('show');
        }
    }
    
    // 格式化时间
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // 滚动到底部
    function scrollToBottom() {
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
    
    // 切换元素显示状态
    function toggleElement(element) {
        if (!element) return;
        
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
    
    // 全局函数: 选择操作
    window.selectAction = function(action) {
        if (messageInput) {
            messageInput.value = action;
            messageInput.focus();
            messageInput.dispatchEvent(new Event('input'));
        }
    };
    
    // 全局函数: 可展开区域控制
    window.toggleExpandable = function(element) {
        const content = element.nextElementSibling;
        const icon = element.querySelector('i');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        } else {
            content.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    };
    
    // 高级分析响应模板: 合同分析
    function generateContractAnalysisResponse() {
        return `
            <div class="ai-analysis">
                <p>我已对<span class="doc-badge" data-doc-id="doc-contract-123">采购合同2025-XC35</span>进行了全面分析，发现以下需要关注的问题：</p>
                
                <div class="analysis-highlights">
                    <div class="highlight-item critical">
                        <i class="fas fa-exclamation-circle text-danger"></i>
                        <div>
                            <strong>高风险条款</strong>
                            <p>第12条款设置了不合理的付款条件，要求预付70%且无保障机制</p>
                        </div>
                    </div>
                    <div class="highlight-item warning">
                        <i class="fas fa-exclamation-triangle text-warning"></i>
                        <div>
                            <strong>潜在风险</strong>
                            <p>交付时间条款(第8条)与附录B时间表存在冲突</p>
                        </div>
                    </div>
                    <div class="highlight-item opportunity">
                        <i class="fas fa-lightbulb text-success"></i>
                        <div>
                            <strong>优化机会</strong>
                            <p>可以通过修改第15条知识产权条款增强保护力度</p>
                        </div>
                    </div>
                </div>
                
                <div class="expandable-section">
                    <div class="expandable-header" onclick="toggleExpandable(this)">
                        <i class="fas fa-chevron-right"></i>
                        <strong>详细分析（点击展开）</strong>
                    </div>
                    <div class="expandable-content" style="display:none;">
                        <table class="analysis-table mt-2">
                            <tr>
                                <th>条款</th>
                                <th>问题</th>
                                <th>风险等级</th>
                                <th>建议</th>
                            </tr>
                            <tr>
                                <td>第12条：付款条件</td>
                                <td>预付款比例过高(70%)且无担保</td>
                                <td><span class="badge bg-danger">高风险</span></td>
                                <td>降低预付比例至30%，要求对方提供履约保函</td>
                            </tr>
                            <tr>
                                <td>第8条：交付时间</td>
                                <td>与附录B时间表冲突</td>
                                <td><span class="badge bg-warning">中风险</span></td>
                                <td>统一交付时间表，明确以正文为准</td>
                            </tr>
                            <tr>
                                <td>第15条：知识产权</td>
                                <td>保护力度不足</td>
                                <td><span class="badge bg-info">低风险</span></td>
                                <td>增加保密条款和侵权赔偿条款</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div class="action-section">
                    <p>您希望我如何协助处理这些问题？</p>
                    <div class="action-buttons">
                        <button class="action-button primary" onclick="selectAction('帮我修改这些问题条款')">
                            <i class="fas fa-edit"></i>
                            修改问题条款
                        </button>
                        <button class="action-button" onclick="selectAction('生成详细风险报告')">
                            <i class="fas fa-file-alt"></i>
                            生成风险报告
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 高级分析响应模板: 财务分析
    function generateFinancialAnalysisResponse() {
        return `
            <div class="ai-analysis">
                <p>我已分析<span class="doc-badge" data-doc-id="doc-financial-456">财务报表Q2</span>，以下是关键发现：</p>
                
                <div class="finance-metrics">
                    <div class="metric-card positive">
                        <div class="metric-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-title">营收增长</div>
                            <div class="metric-value">+15.3%</div>
                            <div class="metric-compare">同比增长</div>
                        </div>
                    </div>
                    <div class="metric-card warning">
                        <div class="metric-icon">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-title">毛利率</div>
                            <div class="metric-value">-2.1%</div>
                            <div class="metric-compare">较上季度</div>
                        </div>
                    </div>
                    <div class="metric-card positive">
                        <div class="metric-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="metric-content">
                            <div class="metric-title">现金流</div>
                            <div class="metric-value">+8.7%</div>
                            <div class="metric-compare">较上季度</div>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-summary mt-3">
                    <p>主要分析结论：</p>
                    <ul>
                        <li>营收持续增长，但成本上升导致毛利率下降</li>
                        <li>运营成本较预算高出8.3%，主要是物流和原材料成本上涨</li>
                        <li>现金流状况良好，短期偿债能力增强</li>
                        <li>研发投入增长27%，可能对未来3-5年产品线有积极影响</li>
                    </ul>
                </div>
                
                <div class="expandable-section">
                    <div class="expandable-header" onclick="toggleExpandable(this)">
                        <i class="fas fa-chevron-right"></i>
                        <strong>详细财务指标（点击展开）</strong>
                    </div>
                    <div class="expandable-content" style="display:none;">
                        <table class="analysis-table mt-2">
                            <tr>
                                <th>指标</th>
                                <th>本季度</th>
                                <th>上季度</th>
                                <th>同比</th>
                                <th>趋势</th>
                            </tr>
                            <tr>
                                <td>营业收入</td>
                                <td>¥24.5M</td>
                                <td>¥21.2M</td>
                                <td>+15.3%</td>
                                <td><i class="fas fa-arrow-up text-success"></i></td>
                            </tr>
                            <tr>
                                <td>毛利率</td>
                                <td>42.7%</td>
                                <td>44.8%</td>
                                <td>-2.1%</td>
                                <td><i class="fas fa-arrow-down text-danger"></i></td>
                            </tr>
                            <tr>
                                <td>运营费用</td>
                                <td>¥7.2M</td>
                                <td>¥6.3M</td>
                                <td>+14.3%</td>
                                <td><i class="fas fa-arrow-up text-danger"></i></td>
                            </tr>
                            <tr>
                                <td>研发投入</td>
                                <td>¥3.8M</td>
                                <td>¥3.0M</td>
                                <td>+26.7%</td>
                                <td><i class="fas fa-arrow-up text-success"></i></td>
                            </tr>
                            <tr>
                                <td>净利润</td>
                                <td>¥5.1M</td>
                                <td>¥4.9M</td>
                                <td>+4.1%</td>
                                <td><i class="fas fa-arrow-up text-success"></i></td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div class="action-section">
                    <p>您希望进一步了解哪些财务指标？</p>
                    <div class="action-buttons">
                        <button class="action-button primary" onclick="selectAction('分析运营成本上升的原因')">
                            <i class="fas fa-search-dollar"></i>
                            成本分析
                        </button>
                        <button class="action-button" onclick="selectAction('预测下季度财务趋势')">
                            <i class="fas fa-chart-line"></i>
                            趋势预测
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 高级分析响应模板: 文档对比
    function generateDocumentComparisonResponse() {
        return `
            <div class="ai-analysis">
                <p>我已完成对两份文档的比较分析：</p>
                
                <div class="comparison-header">
                    <div class="doc-comparison-item">
                        <div class="doc-icon"><i class="fas fa-file-contract"></i></div>
                        <div class="doc-title">采购合同2025-XC35</div>
                    </div>
                    <div class="comparison-vs">VS</div>
                    <div class="doc-comparison-item">
                        <div class="doc-icon"><i class="fas fa-file-contract"></i></div>
                        <div class="doc-title">采购合同2024-XC28</div>
                    </div>
                </div>
                
                <div class="comparison-summary">
                    <div class="similarity-meter">
                        <div class="similarity-label">整体相似度</div>
                        <div class="similarity-bar">
                            <div class="similarity-progress" style="width: 78%"></div>
                        </div>
                        <div class="similarity-value">78%</div>
                    </div>
                    
                    <p class="mt-3">主要差异：</p>
                    <ul class="diff-list">
                        <li class="diff-item added">
                            <i class="fas fa-plus-circle text-success"></i>
                            <div>付款条款新增预付款比例从50%提高到70%</div>
                        </li>
                        <li class="diff-item changed">
                            <i class="fas fa-exchange-alt text-warning"></i>
                            <div>交付期限从45天缩短至30天</div>
                        </li>
                        <li class="diff-item removed">
                            <i class="fas fa-minus-circle text-danger"></i>
                            <div>移除了买方单方面终止合同的权利条款</div>
                        </li>
                        <li class="diff-item added">
                            <i class="fas fa-plus-circle text-success"></i>
                            <div>新增不可抗力条款，包含疫情相关内容</div>
                        </li>
                    </ul>
                </div>
                
                <div class="expandable-section">
                    <div class="expandable-header" onclick="toggleExpandable(this)">
                        <i class="fas fa-chevron-right"></i>
                        <strong>详细差异（点击展开）</strong>
                    </div>
                    <div class="expandable-content" style="display:none;">
                        <table class="analysis-table mt-2">
                            <tr>
                                <th>条款</th>
                                <th>2025-XC35</th>
                                <th>2024-XC28</th>
                                <th>变更影响</th>
                            </tr>
                            <tr>
                                <td>第4条：付款条件</td>
                                <td>预付70%，交付后30天内支付剩余30%</td>
                                <td>预付50%，交付后30天内支付剩余50%</td>
                                <td><span class="badge bg-danger">不利变更</span></td>
                            </tr>
                            <tr>
                                <td>第8条：交付期限</td>
                                <td>签约后30天内</td>
                                <td>签约后45天内</td>
                                <td><span class="badge bg-warning">中性变更</span></td>
                            </tr>
                            <tr>
                                <td>第12条：合同终止</td>
                                <td>双方协商一致可终止</td>
                                <td>买方提前15天通知可单方面终止</td>
                                <td><span class="badge bg-danger">不利变更</span></td>
                            </tr>
                            <tr>
                                <td>第17条：不可抗力</td>
                                <td>包含疫情、战争、自然灾害等</td>
                                <td>仅包含自然灾害</td>
                                <td><span class="badge bg-success">有利变更</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div class="action-section">
                    <p>您需要进一步了解哪些差异？</p>
                    <div class="action-buttons">
                        <button class="action-button primary" onclick="selectAction('详细分析不利变更的风险')">
                            <i class="fas fa-shield-alt"></i>
                            分析风险变更
                        </button>
                        <button class="action-button" onclick="selectAction('生成一份变更对照表')">
                            <i class="fas fa-file-export"></i>
                            导出对照表
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 高级分析响应模板: 风险评估
    function generateRiskAssessmentResponse() {
        return `
            <div class="ai-analysis">
                <p>我已对<span class="doc-badge" data-doc-id="doc-contract-123">采购合同2025-XC35</span>进行风险评估，发现以下关键风险点：</p>
                
                <div class="risk-matrix">
                    <div class="risk-item critical">
                        <div class="risk-rating">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>高风险</span>
                        </div>
                        <div class="risk-content">
                            <div class="risk-title">付款风险</div>
                            <div class="risk-desc">70%预付款比例过高，无足够担保措施</div>
                        </div>
                    </div>
                    <div class="risk-item critical">
                        <div class="risk-rating">
                            <i class="fas fa-exclamation-circle"></i>
                            <span>高风险</span>
                        </div>
                        <div class="risk-content">
                            <div class="risk-title">终止权限风险</div>
                            <div class="risk-desc">缺乏单方面终止合同权利，导致主动权减弱</div>
                        </div>
                    </div>
                    <div class="risk-item warning">
                        <div class="risk-rating">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>中风险</span>
                        </div>
                        <div class="risk-content">
                            <div class="risk-title">交付时间风险</div>
                            <div class="risk-desc">30天交付期限较短，可能无法满足实际需求</div>
                        </div>
                    </div>
                    <div class="risk-item low">
                        <div class="risk-rating">
                            <i class="fas fa-info-circle"></i>
                            <span>低风险</span>
                        </div>
                        <div class="risk-content">
                            <div class="risk-title">知识产权风险</div>
                            <div class="risk-desc">知识产权保护条款不够明确</div>
                        </div>
                    </div>
                </div>
                
                <div class="risk-score-container">
                    <div class="risk-score-header">整体风险评分</div>
                    <div class="risk-score-gauge">
                        <div class="risk-needle" style="transform: rotate(65deg)"></div>
                        <div class="risk-label low">低</div>
                        <div class="risk-label medium">中</div>
                        <div class="risk-label high">高</div>
                    </div>
                    <div class="risk-score-value warning">中高风险 (7.5/10)</div>
                </div>
                
                <div class="expandable-section">
                    <div class="expandable-header" onclick="toggleExpandable(this)">
                        <i class="fas fa-chevron-right"></i>
                        <strong>风险缓解建议（点击展开）</strong>
                    </div>
                    <div class="expandable-content" style="display:none;">
                        <ul class="mitigation-list mt-2">
                            <li class="mitigation-item">
                                <div class="mitigation-header">
                                    <i class="fas fa-shield-alt text-primary"></i>
                                    <strong>预付款风险缓解</strong>
                                </div>
                                <div class="mitigation-content">
                                    要求对方提供银行履约保函或将预付款比例降至30%-50%；采用分阶段付款方式，与交付里程碑挂钩。
                                </div>
                            </li>
                            <li class="mitigation-item">
                                <div class="mitigation-header">
                                    <i class="fas fa-shield-alt text-primary"></i>
                                    <strong>合同终止权限</strong>
                                </div>
                                <div class="mitigation-content">
                                    增加单方面终止条款，明确对方违约、延期交付等情况下的终止权，并加入适当的赔偿机制。
                                </div>
                            </li>
                            <li class="mitigation-item">
                                <div class="mitigation-header">
                                    <i class="fas fa-shield-alt text-primary"></i>
                                    <strong>交付时间保障</strong>
                                </div>
                                <div class="mitigation-content">
                                    将交付期延长至45天，或增加交付延期的惩罚性条款，如每延期一天罚款合同总额的0.5%。
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-section">
                    <p>您希望如何处理这些风险点？</p>
                    <div class="action-buttons">
                        <button class="action-button primary" onclick="selectAction('生成风险缓解方案')">
                            <i class="fas fa-tasks"></i>
                            制定缓解方案
                        </button>
                        <button class="action-button" onclick="selectAction('提出合同修改建议')">
                            <i class="fas fa-file-signature"></i>
                            合同修改建议
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 高级分析响应模板: 文档摘要
    function generateDocumentSummaryResponse() {
        return `
            <div class="ai-analysis">
                <p>我已为<span class="doc-badge" data-doc-id="doc-contract-123">采购合同2025-XC35</span>生成了摘要：</p>
                
                <div class="summary-box">
                    <p class="summary-title"><i class="fas fa-file-alt me-2"></i>文档摘要</p>
                    <p>这是一份设备采购合同，总价值¥1,250,000，约定由供应商向买方提供20台特定型号的设备。合同主要条款包括：预付70%货款，交付期为签约后30天，质保期12个月，违约金为合同总额的10%。</p>
                    <p>特殊条款包括：不可抗力包含疫情情况，争议解决优先协商后仲裁，保密期限为5年。合同有效期至2025年12月31日。</p>
                </div>
                
                <div class="key-points">
                    <p class="key-points-title"><i class="fas fa-key me-2"></i>关键要点</p>
                    <ul>
                        <li>合同总价值：¥1,250,000</li>
                        <li>设备数量：20台</li>
                        <li>付款条件：预付70%，交付后30天内支付30%</li>
                        <li>交付期限：签约后30天内</li>
                        <li>质保期：12个月</li>
                        <li>违约金：合同总额的10%</li>
                    </ul>
                </div>
                
                <div class="expandable-section">
                    <div class="expandable-header" onclick="toggleExpandable(this)">
                        <i class="fas fa-chevron-right"></i>
                        <strong>重要日期（点击展开）</strong>
                    </div>
                    <div class="expandable-content" style="display:none;">
                        <div class="timeline mt-2">
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-date">签约日期：2025年4月15日</div>
                                    <div class="timeline-desc">合同生效，预付款支付截止日</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-date">2025年5月15日</div>
                                    <div class="timeline-desc">设备交付截止日期</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-date">2025年6月15日</div>
                                    <div class="timeline-desc">剩余款项支付截止日期</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-date">2026年5月15日</div>
                                    <div class="timeline-desc">设备质保期结束</div>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-date">2025年12月31日</div>
                                    <div class="timeline-desc">合同有效期结束</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-section">
                    <p>需要我对某方面进行更详细分析吗？</p>
                    <div class="action-buttons">
                        <button class="action-button primary" onclick="selectAction('详细分析付款条款')">
                            <i class="fas fa-money-bill-wave"></i>
                            分析付款条款
                        </button>
                        <button class="action-button" onclick="selectAction('分析合同履约风险')">
                            <i class="fas fa-exclamation-triangle"></i>
                            合同风险分析
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 通用响应模板
    function generateGeneralResponse() {
        return `
            <div class="ai-general-response">
                <p>我可以帮您进行多种文档智能分析任务。以下是我可以协助的几个方向：</p>
                
                <div class="service-grid">
                    <div class="service-item" onclick="selectAction('帮我分析这份合同的主要风险')">
                        <div class="service-icon">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <div class="service-title">合同分析</div>
                        <div class="service-desc">识别风险条款，解读法律条款，提供修改建议</div>
                    </div>
                    <div class="service-item" onclick="selectAction('分析我的财务报表数据')">
                        <div class="service-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="service-title">财务分析</div>
                        <div class="service-desc">解读财务数据，趋势分析，成本优化建议</div>
                    </div>
                    <div class="service-item" onclick="selectAction('比较两个文档的差异')">
                        <div class="service-icon">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <div class="service-title">文档对比</div>
                        <div class="service-desc">识别变更点，高亮差异，评估影响</div>
                    </div>
                    <div class="service-item" onclick="selectAction('评估这个项目的风险')">
                        <div class="service-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="service-title">风险评估</div>
                        <div class="service-desc">全面风险分析，风险评分，缓解方案</div>
                    </div>
                </div>
                
                <p class="mt-3">或者您可以告诉我您需要处理什么具体文档？我将根据文档类型提供针对性的帮助。</p>
            </div>
        `;
    }
    
    // 初始化聊天功能
    initChat();
});