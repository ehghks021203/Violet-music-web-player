import React from 'react';
import './TopPages.css';
import Topbar from '../../topbar/Topbar';


function SupportPage() {
    return (
        <div className='top-page-main-window'>
            <Topbar />
            <h2 className='top-page-title'>Support</h2>
            <h3 className='top-page-subtitle'>Violet - 고객 지원 서비스</h3><br/>
            <span className='top-page-context'>
                고객 여러분께서 violet을 사용하면서 궁금한 점이나 문제가 발생했을 때, 저희는 항상 도움을 드리기 위해 여기에 있습니다. 
                violet은 우수한 고객 지원 서비스를 제공하여 사용자들이 원활하게 음악 스트리밍 서비스를 이용할 수 있도록 최선을 다하고 있습니다.
                <br/><br/>
                지원팀은 여러분의 질문과 문제에 신속하고 친절하게 대응하기 위해 구성되어 있습니다. 
                다양한 문의 사항에 대한 도움을 드리기 위해 이메일을 통해 24시간 지원을 제공하고 있습니다. 
                우리의 지원팀은 음악 관련 문제, 기술적인 어려움, 결제 및 계정 문제 등 다양한 주제에 대해 전문적인 도움을 드릴 수 있습니다.
                <br/><br/>
                또한, 우리는 지속적인 개선을 위해 사용자들의 의견과 제안을 환영합니다. 
                사용자들의 피드백은 우리의 서비스 품질 향상에 큰 도움이 됩니다. 
                음악 스트리밍 경험을 개선하기 위해 요청 사항이나 아이디어가 있다면 언제든지 연락 주시기 바랍니다.
                <br/><br/>
                우리는 사용자들의 개인 정보와 데이터 보안을 매우 중요하게 여깁니다. 
                모든 개인 정보는 엄격한 보안 프로토콜을 따르며, violet은 개인 정보 보호 및 데이터 보안 관련 법률과 규정을 준수합니다.
                <br/><br/>
                violet은 항상 최고의 고객 서비스를 제공하기 위해 노력하고 있으며, 사용자들이 원활하게 서비스를 이용하고 음악을 즐길 수 있도록 도와드리기 위해 노력할 것입니다. 
                언제든지 문의 사항이 있으시면 저희 지원팀에 연락 주세요. 우리는 항상 여러분의 편의를 위해 최선을 다할 것입니다.
                <br/><br/><br/>
                지원팀 이메일: pjw90581324@gmail.com
            </span>
            <table className='search-music-list-table'></table>
        </div>
    );
}

export default SupportPage;