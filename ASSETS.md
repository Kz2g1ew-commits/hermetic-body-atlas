# 외부 자산

## 현재 사용하는 인체 메시

- 파일: `public/models/makehuman-base-cc0.obj`
- 원본: https://github.com/makehumancommunity/makehuman/blob/master/makehuman/data/3dobjs/base.obj
- 제작자: MakeHuman 프로젝트
- 라이선스: Creative Commons CC0 1.0 Universal (원본 OBJ 헤더 명시)
- SHA-256: `8e761e6624b8f54536409135d1636da63b32486a90d4897f84e121d144f6fb4c`
- 로컬 라이선스 사본: `public/models/MAKEHUMAN_LICENSE.md`
- 라이선스 사본 SHA-256: `edd99571ca62698f78c943fd4fffb159a413c315fa0d4819d3cec5cadaf8b4f1`

런타임은 원본의 `body`, `helper-l-eye`, `helper-r-eye`, `helper-tongue` 그룹만 사용합니다. 귀는 별도 구체나 임의 중심점이 아니라 `body` 표면의 귓바퀴 영역 삼각형을 추출해 강조합니다. 홍채와 동공, 전기·자기·중성 표식만 Three.js 기하로 덧붙였습니다.

이 파일은 MakeHuman의 성별·연령 슬라이더가 적용된 완성 캐릭터가 아니라 공식 중성 기본 메시입니다. 사이트의 ‘남성형 보정’은 원본 정점 수와 토폴로지를 유지하면서 어깨·흉곽 부근의 가로·깊이를 완만하게 늘리고 골반 부근의 가로 폭을 줄이는 런타임 표시 변환입니다. MakeHuman의 공식 남성 morph target을 적용한 새 데이터셋이라고 주장하지 않으며, ‘원본’ 보기에서 변환을 완전히 끌 수 있습니다.
