'use client';

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

export function Component() {
  const [qnaData, setQnaData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [openItems, setOpenItems] = useState({}); // 개별 항목의 토글 상태를 관리하는 객체

  const handleToggleQA = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api');
      if (response.ok) {
        const data = await response.json();
        setQnaData(data.results);
        // 초기 토글 상태 설정: 모든 항목을 false (숨김)으로 설정
        const initialState = data.results.reduce((acc, item, index) => {
          acc[index] = false;
          return acc;
        }, {});
        setOpenItems(initialState);
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('Updated QnA Data:', qnaData);
  }, [qnaData]);

  const toggleItem = (index) => {
      setOpenItems(prev => {
          const newState = { ...prev, [index]: !prev[index] };
          console.log("Toggled state for index", index, ":", newState[index]);
          return newState;
      });
  };

  return (
    <div className="w-full px-4 py-10 space-y-6 md:px-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">기상캐스터</h1>
          <p className="text-black dark:text-black">
            기업부문 신규 상품에서 발생하는 궁금한 것에 대하여 가장 빠르고 정확한 답변을 제공합니다.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">질문하기</h2>
          <p className="text-black dark:text-black">문의할 내용을 아래에 입력하고 완료버튼을 눌러주세요</p>
          <Label htmlFor="question">질문내용</Label>
          <Textarea id="question" required className="space-y-4" />
          <Button className="w-full" onClick={handleToggleQA}>완료</Button>
        </div>
        {isLoading ? <p>Loading...</p> : qnaData.map((qna, index) => (
          <Collapsible key={index} className="space-y-2">
            <CollapsibleTrigger asChild>
              <div className="flex items-center space-x-4 cursor-pointer" onClick={() => toggleItem(index)}>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{qna.login.username}</h3>
                  <p className="text-sm text-black dark:text-black">{qna.email}</p>
                </div>
              </div>
            </CollapsibleTrigger>
            {openItems[index] && (
              <CollapsibleContent>
                <div className="prose max-w-none">
                  <p>{JSON.stringify(qna, null, 2)}</p>
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
