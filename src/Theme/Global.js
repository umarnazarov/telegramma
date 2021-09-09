import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .main-conteiner .main-content  {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text};
    transition: .2s ease-in
  }
  .no-chat {
    background-color: ${({ theme }) => theme.noChat};
  }
  .no-chat .no-chat-text {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text};
  }
  .chats-header-conteiner .search-chat {
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.text};
  }
  .chats-container .chats-content .chat-info:hover {
    background-color: ${({ theme }) => theme.secondary};
  }
  .active-chat-thumb {
    background-color: ${({ theme }) => theme.fifth};
    color: ${({ theme }) => theme.third} !important;
  }
.active-chat-thumb:hover {
    background-color: ${({ theme }) => theme.fifth} !important
}
  .styles_scrollable-div__prSCv {
    background-color: ${({ theme }) => theme.noChat};
  }
  .active-user-conteiner .active-user-chat .active-you-chat .active-you-chat-text {
    background-color: ${({ theme }) => theme.fourth};
  }
.active-user-conteiner .active-user-chat .active-person-chat .active-person-chat-text {
    background-color: ${({ theme }) => theme.mainContent};
}
.chat-text-info .chat-text-right .chat-new-msg-notif {
    background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.text}
}
.ham-container .ham-content .ham-user-info {
    background-color: ${({ theme }) => theme.fifth};
    color: ${({ theme }) => theme.third} !important;
}
.ham-container .ham-content {
    background-color: ${({ theme }) => theme.mainContent};
}
.ham-container .ham-links .ham-link {
    color: ${({ theme }) => theme.text} !important;
}
.ham-container .ham-links .ham-link:hover {
    background-color: ${({ theme }) => theme.secondary};
}
.active-user-conteiner .active-chat-form .active-chat-input {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text};
}
.modal-container {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text} 
}
.user-modal:hover{
    color: ${({ theme }) => theme.text}
}
.emoji-picker-react, .emoji-group:before {
    background-color: ${({ theme }) => theme.mainContent} !important;
}
.msg-time {
    color: ${({ theme }) => theme.third} !important;
}

.main-conteiner {
    background-color: ${({ theme }) => theme.bg} !important;
}
::-webkit-scrollbar-track {
  background:${({ theme }) => theme.secondary} !important; ;
  border-radius: 30px
}
.chats-header-conteiner {
    background-color: ${({ theme }) => theme.mainContent} 
}
.setting-container {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text} !important;
}

.setting-user-info {
    background-color: ${({ theme }) => theme.fifth};
}
.setting-user-info .setting-user-btn {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text} !important;
}
.found-user:hover {
    background-color: ${({ theme }) => theme.secondary};
}

.contacts-container {
    background-color: ${({ theme }) => theme.mainContent};
    color: ${({ theme }) => theme.text} !important;
}

.contacts-container .contacts-navigation {
    background-color: ${({ theme }) => theme.mainContent};
}

.u-contact:hover {
    background-color: ${({ theme }) => theme.secondary};
}
.founded-users {
    background-color: ${({ theme }) => theme.mainContent};
}
.name-ch {
      background-color: ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.text};

}
`;