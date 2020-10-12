const texts = [
    '실례합니다. 서울역에 어떻게 가요? 저기에서 163번 버스를 타세요. 서울역까지 얼마나 걸려요? 30분쯤 걸려요. 감사합니다.',
    '저기요. 인사동에 어떻게 가요? 지하철 2호선을 타세요. 어디에서 내려요? 안국 역에서 내리세요. 감사합니다.',
    '미에코 씨, 가방 샀어요? 네, 샀어요. 언제 샀어요? 3일 전에 샀어요.',
    '앤디 씨, 월요일 학교에 갔어요? 아니요, 안 갔어요. 왜 안 갔어요? 아팠어요.',
    '완 씨, 어제 뭐 했어요? 집에 있었어요. 집에서 뭐 했어요? 청소했어요. 그리고 요리도 했어요.',
    '어서 오세요. 사과 좀 주세요? 얼마예요? 세 개에 5,000원이에요. 맛있어요? 네, 아주 맛있는 사과예요. 그럼 10,000원어치 주에요.',
    '전자사전 점 보여 주세요. 전자사전요? 이거 어때요? 좀 커요. 작은 사전 없어요? 그럼, 이거 어때요? 좋아요. 이거 주세요.',

];

export const generate = (count = 10) => {
    let num = Math.floor(Math.random() * texts.length);
    return texts[num];
    /**
    return new Array(count)
        .fill()
        .map(_ => faker.random.word())
        .join(' ');
     */
};