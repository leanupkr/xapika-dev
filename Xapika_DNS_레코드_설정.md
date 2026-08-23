# Xapika 웹사이트 — DNS 레코드 등록 안내

**도메인:** `xapika.pl` (등록기관: GoDaddy)
**받는 분:** 도메인 관리자
**보낸 곳:** LeanUp · admin@leanup.kr

안녕하세요. `xapika.pl` 도메인에 아래 **6개 DNS 레코드**를 추가해 주세요.
등록하시면 **웹사이트 접속(HTTPS·SSL) + 문의 이메일 발송 + 구글 검색 등록**이 모두 자동으로 작동합니다.
값은 전부 **확정된 값**이라 그대로 입력하시면 됩니다.

---

## 1. 추가할 레코드 (6개)

| # | 타입(Type) | 이름·호스트(Name) | 값(Value) | 우선순위(Priority) |
|---|-----------|-------------------|-----------|--------------------|
| 1 | **A** | `@` | `216.198.79.1` | — |
| 2 | **TXT** | `resend._domainkey` | (아래 **#2 DKIM 전체값** 참조) | — |
| 3 | **MX** | `send` | `feedback-smtp.eu-west-1.amazonses.com` | `10` |
| 4 | **TXT** | `send` | `v=spf1 include:amazonses.com ~all` | — |
| 5 | **TXT** | `_dmarc` | `v=DMARC1; p=none;` | — |
| 6 | **TXT** | `@` | `google-site-verification=FlNfYyl8QHVgYEVHJbEJDJ_8_42bhJ_rNZ3QM6EwNZY` | — |

- TTL은 모두 **기본값(1 Hour / Automatic)** 그대로 두시면 됩니다.

### #2 DKIM 키 — 전체값 (레코드 #2의 Value)

아래 한 줄을 **그대로 복사**해 붙여넣어 주세요.

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhtEu9lK3fY0ELnxV5WOAdPgR8uvwhqGC4ALH8ERICyVfgxPjFHAp/XTOyt8IJMIO6841xuaCdIiFXFExRjqYN931p3Oz5byhk4lMO4CC7Jb7f5/SWxeajN1nPz9MzGK5kd61WPlFqI2M46xXNqy98IQQmW7kP5WOaUV4AVAOO/QIDAQAB
```

> ⚠️ DKIM 키는 **한 글자라도 틀리면 인증이 실패**합니다. 직접 타이핑하지 말고 위 코드블록을 그대로 복사해 주세요.

---

## 2. GoDaddy 등록 방법

1. GoDaddy 로그인 → 우측 상단 계정 → **My Products(내 상품)**
2. **Domains**에서 `xapika.pl` 옆 **DNS** (또는 **Manage DNS**) 클릭
3. **Add New Record(레코드 추가)**로 위 표의 레코드를 하나씩 추가:
   - **Type**(타입), **Name**(이름·호스트), **Value**(값) 입력
   - **MX(#3)** 만 **Priority(우선순위)** 칸에 `10` 입력
4. **A 레코드(#1)**: `@`에 **기존 A 레코드가 이미 있으면** 그 값을 `216.198.79.1`로 **수정(Edit)**, 없으면 새로 추가
5. 모두 입력했으면 **Save(저장)**

### 입력 시 참고
- 이름(Name)의 **`@`** 는 도메인 자체(`xapika.pl`)를 뜻합니다. GoDaddy에서는 `@`로 그대로 입력하시면 됩니다.
- `send`, `resend._domainkey`, `_dmarc` 는 **그대로** 입력하세요 (GoDaddy가 자동으로 뒤에 `.xapika.pl`을 붙입니다).
- TXT 값에 **따옴표(" ")를 넣지 마세요** — GoDaddy가 자동 처리합니다.

---

## 3. 주의사항 (중요)

- **회사 메일을 사용 중이라면**, 루트 `@`의 **기존 MX 레코드는 절대 건드리지 마세요.** 레코드 #3(MX)은 `send` 전용이라 회사 메일 수신과 **충돌하지 않습니다.**
- `@`에 기존 **주차 페이지(Parked)·포워딩용 A 레코드**가 있으면 레코드 #1로 **교체**해 주세요 (그대로 두면 사이트 연결 안 됨).
- `@`에 TXT가 여러 개여도 **공존 가능**합니다 (#6 구글 인증 + 기존 TXT). **기존 TXT는 삭제하지 마세요.**
- 혹시 `xapika.pl`에 **CAA 레코드**가 설정돼 있다면, `letsencrypt.org`를 허용 대상에 추가해 주세요 (대부분 CAA가 없어 신경 쓸 필요 없습니다).

---

## 4. 등록 후

등록을 마치시면 **회신 주세요.** DNS는 보통 **10분 ~ 수 시간**(최대 48시간) 안에 전파됩니다.
전파되면 저희(LeanUp)가 도메인 연결·SSL·이메일 인증·검색 등록 상태를 확인하고 마무리하겠습니다.

추가로 입력하실 값이나 화면 캡처가 필요하시면 언제든 말씀해 주세요.

— 문의: **LeanUp · admin@leanup.kr**
