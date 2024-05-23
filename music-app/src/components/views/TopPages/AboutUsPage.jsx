import React from 'react';
import './TopPages.css';
import Topbar from '../../topbar/Topbar';


function AboutUsPage() {
    return (
        <div className='top-page-main-window'>
            <Topbar />
            <h2 className='top-page-title'>About Us</h2>
            <h3 className='top-page-subtitle'>Violet - 좋아하는 음악을 공유하세요!</h3><br/>
            <span className='top-page-context'>
                violet에 오신 것을 환영합니다. violet은 음악을 발견하고 공유하며 즐기는 방식을 혁신하고자 하는 혁신적인 음악 스트리밍 서비스입니다.
                깔끔한 사용자 인터페이스, 맞춤형 추천 기능 및 다양한 기능을 제공하여 violet은 음악 스트리밍 경험을 향상시키고 음악 애호가들과 연결시키는 것을 목표로 합니다. 
                <br/><br/>
                우리의 주요 목표는 사용자들에게 새로운 음악을 소개하고 음악 애호가들의 활발한 공동체를 만드는 것입니다. violet의 뛰어난 기능 중 하나는 포괄적인 차트 시스템입니다. 
                주간, 월간 또는 장르별 차트에 관심이 있든지, 우리는 여러분을 위해 다양한 차트를 제공합니다. 
                최신 음악 트렌드를 알고 다양한 카테고리에서 인기 있는 곡을 발견하세요. 
                <br/><br/>
                violet은 또한 타이머 기능을 통해 음악 재생 시간을 자동으로 설정하여 잠들거나 집중할 때 음악이 무한히 재생되는 것에 대해 걱정하지 않아도 됩니다. 
                보안에 관해서는, 우리는 여러분의 개인 정보와 데이터 보호를 우선시합니다. 모든 비밀번호는 SHA-256 알고리즘을 사용하여 해싱되어 계정의 보안을 더욱 강화합니다.
                violet의 개발팀은 효율적인 UI 구축과 부드러운 렌더링을 위해 JavaScript 기반 라이브러리인 React를 활용합니다. 표준화된 웹 문서를 작성하여 접근성과 높은 가시성을 보장하기 위해 HTML/CSS를 활용합니다. 
                직관적인 코드 작성과 텍스트 처리를 위해 특화된 웹 개발 언어인 PHP를 사용합니다. 마지막으로 강력한 관계형 데이터베이스인 MySQL을 사용하여 대용량 데이터셋을 효율적으로 처리하고 원활한 데이터 관리를 보장합니다.
                <br/><br/>
                violet은 혁신, 편의성 및 활기찬 커뮤니티를 결합하여 전례없는 음악 스트리밍 경험을 제공하기 위해 노력하고 있습니다. 
                violet과 함께 음악을 새롭게 발견하고 음악 애호가들과 연결되며 음악적 여정의 전체 잠재력을 발휘하세요. 
                새로운 음악을 발견하고 음악 애호가들과 소통하며 violet과 함께하는 흥미로운 여정에 참여해보세요.

            </span>
            <table className='search-music-list-table'></table>
        </div>
    );
}

export default AboutUsPage;