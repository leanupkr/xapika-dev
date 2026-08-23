# Xapika 웹사이트 — DNS 레코드 등록 안내 (xapika.co.kr / 가비아)

**도메인:** `xapika.co.kr` (등록기관: **가비아**, 명의: 하리카 엔지니어링)
**보낸 곳:** LeanUp · admin@leanup.kr
**작성일:** 2026-06-15

> 기존 `xapika.pl`(GoDaddy)에서 **주력 도메인을 `xapika.co.kr`로 전환**합니다.
> 사이트(웹) + 문의 메일 **발신**을 `.co.kr` 기준으로 운영하고, 문의 메일 **수신**은 기존 `info@xapika.pl` 그대로 유지합니다.

---

## 1. 가비아 DNS관리툴에 등록할 레코드

> 가비아 My가비아 → 서비스 관리 → `xapika.co.kr` → **DNS 관리툴**에서 추가합니다.
> 호스트(이름)에는 도메인을 빼고 아래 값만 넣으면 가비아가 자동으로 `.xapika.co.kr`을 붙입니다.

| # | 타입 | 호스트(이름) | 값/레코드 | 우선순위 |
|---|------|-------------|-----------|----------|
| 1 | **A** | `@` | `216.198.79.1` | — |
| 2 | **TXT** | `resend._domainkey` | (아래 **#DKIM 전체값** 참조) | — |
| 3 | **MX** | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | `10` |
| 4 | **TXT** | `send` | `v=spf1 include:amazonses.com ~all` | — |
| 5 | **TXT** | `_dmarc` | `v=DMARC1; p=none;` | — |
| 6 | **TXT** | `@` | `google-site-verification=…` (Search Console 토큰 — 발급 후 기입) | — |

- TTL은 모두 **기본값(자동)** 그대로 둡니다.
- TXT 값에 따옴표(`" "`)는 넣지 않습니다.

### #DKIM 전체값 (레코드 #2의 값) — Tokyo(ap-northeast-1) 리전

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAjzjKO2FDMHNeVumpxOv2qXkign0loX5TwXEEQadeUre9OcA8O7XT0ydJXgviiSNxGWy/o+CqQdGx9sRaRmD0OxS7ion/kX46wMQjhXeqPsu1Os31ULnvX06OQ+wn4J8G2+BWuWVlcMci7B9Q12dlPFbgrDxnD/CCkfa5100WwwIDAQAB
```

> ⚠️ DKIM은 한 글자라도 틀리면 인증 실패. 위 코드블록을 그대로 복사해 붙여넣으세요.

---

## 2. 각 레코드의 역할

- **#1 A (`@`)** — `xapika.co.kr` 웹사이트를 Vercel에 연결 (HTTPS·SSL 자동).
- **#2 DKIM / #3 MX / #4 SPF** — Resend 발신 도메인 `xapika.co.kr` 인증 (문의 폼 메일 발신용). 리전은 Tokyo(ap-northeast-1).
- **#5 DMARC** — 메일 인증 정책(모니터링 only).
- **#6 Google 인증 TXT** — Search Console 도메인 속성 인증 (색인용). 토큰은 Search Console에서 `xapika.co.kr` 속성 추가 시 발급.

---

## 3. 참고 / 주의

- **수신 메일은 그대로 `info@xapika.pl`** 입니다. 위 MX(#3)는 `send` 서브도메인 전용(발신 바운스 처리용)이라 수신과 무관합니다.
- `www.xapika.co.kr`는 연결하지 않습니다 (canonical이 apex 기준 — 의도적). 필요 시 CNAME 1개 추가로 연결 가능.
- 기존 `xapika.pl`(GoDaddy)은 휴면 상태로 둡니다 (DNS 미등록 → 미서빙). 리다이렉트 불필요.

---

## 4. 등록 후 확인 (LeanUp)

- Vercel: `xapika.co.kr` 도메인 Valid Configuration 확인 → SSL 발급.
- Resend: `xapika.co.kr` Verified 확인 → 문의 폼 발신 정상화.
- Search Console: `xapika.co.kr` 속성 verify → 사이트맵 제출·색인 요청.

— 문의: **LeanUp · admin@leanup.kr**
