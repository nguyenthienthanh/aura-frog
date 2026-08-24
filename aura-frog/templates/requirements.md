# Requirements — [Tên tính năng]

**Trạng thái:** ideation | discussion | published | committed | abandoned
**Owner:** [ai chịu trách nhiệm] · **Ngày:** YYYY-MM-DD · **Ticket:** [JIRA-…]
**Đọc bởi:** [ai đọc, để ra quyết định gì]

---

## Vấn đề

Cái gì đang sai/thiếu hôm nay, đo bằng gì? **Chưa nói giải pháp.**

## Non-goals

Cố tình KHÔNG làm: …

## Thành công trông như thế nào

Tiêu chí **đo được**, kèm cách đo. Không có số đo thật thì ghi `[UNVERIFIED] — sẽ đo bằng …`,
đừng bịa ngưỡng.

---

## Yêu cầu

<!--
Mỗi requirement mang bộ thuộc tính tối thiểu (INCOSE GtWR v4, A1–A49, tập đánh dấu `*`).
Đây chính là móc truy vết requirement → thiết kế → test.
-->

### REQ-001 — [tên]

> **Phát biểu:** [Chủ thể] **shall** [hành động] [điều kiện] [ràng buộc đo được].

| Thuộc tính | Giá trị |
|---|---|
| Rationale | *vì sao cần — thiếu ô này thì C1 Necessary không kiểm được* |
| Trace to Parent | REQ-… hoặc nhu cầu gốc |
| Trace to Source | ai/tài liệu nào yêu cầu |
| Verification Method | test / phân tích / kiểm tra / demo |
| Verification Success Criteria | **đúng cái gì xảy ra thì coi là đạt** |
| Owner | |
| Priority · Criticality · Risk | |

---

## Cổng chất lượng — GtWR v4 (INCOSE, guidance)

Kiểm **từng** requirement (C1–C9):

| | Đạt? |
|---|---|
| C1 Necessary — bỏ đi thì có mất gì không | ☐ |
| C2 Appropriate — đúng mức trừu tượng | ☐ |
| C3 Unambiguous — chỉ hiểu được một nghĩa | ☐ |
| C4 Complete — không cần hỏi thêm để hiểu | ☐ |
| C5 Singular — **một** nghĩa vụ duy nhất | ☐ |
| C6 Feasible — làm được trong ràng buộc thật | ☐ |
| C7 Verifiable — **có cách chứng minh đạt** | ☐ |
| C8 Correct — mô tả đúng nhu cầu thật | ☐ |
| C9 Conforming — theo đúng mẫu câu đã thống nhất | ☐ |

Kiểm **cả tập** (C10–C15):

| | Đạt? |
|---|---|
| C10 Complete — tập đủ, không thiếu mảng nào | ☐ |
| C11 Consistent — không mâu thuẫn nhau | ☐ |
| C12 Feasible — khả thi **khi gộp lại** | ☐ |
| C13 Comprehensible — đọc cả tập vẫn hiểu | ☐ |
| C14 Able to be validated — chứng minh được là đúng thứ cần | ☐ |
| C15 Correct | ☐ |

### Lint máy chạy được (tập con của R1–R42)

- **R7** — cấm mơ hồ: *some, any, several, many, about, approximate*
- **R8** — cấm câu thoát: *as appropriate, as required, to the extent practical, if practicable*
- **R18–R23** — một `shall` một câu; cảnh báo `and`/`or` nối hai nghĩa vụ
- **R32** — `all/every/none` phải kèm phạm vi xác định
- **R33–R35** — số phải có đơn vị và dung sai
- **R36–R40** — cùng một khái niệm dùng cùng một từ xuyên suốt

> ⚠️ Chỉ ~10–12 trong 42 rule kiểm được bằng máy. INCOSE §1.8 nói rõ công cụ NLP/AI *"do not address
> all the rules"* và việc thẩm định *"cannot be done without the project team doing the analysis
> manually."* **Đừng quảng cáo "42 kiểm tra tự động".**

---

## Truy vết

29148 §3.1.23 định nghĩa truy vết là *"the derivation path (upward) and allocation/flow-down path
(downward)"*, dùng thuật ngữ parent/child. **Chuẩn KHÔNG dùng chữ "bidirectional"** — trích đúng chữ
lên/xuống.

| Requirement | Parent | Thiết kế | Test |
|---|---|---|---|
| REQ-001 | | | |

---

## Giả định · Ràng buộc · Phụ thuộc

Mỗi mục ghi rõ **sai thì hỏng cái gì**. Giả định không có hệ quả thì không đáng viết.

---

### Nguồn
**ISO/IEC/IEEE 29148:2018** — chuẩn normative đang hiệu lực (thay IEEE 830-1998 qua bản 2011; bản
2011 cũng thay IEEE 1233 và 1362). Tách characteristics của requirement đơn lẻ (§5.2.5) khỏi
characteristics của **tập** (§5.2.6), cộng language criteria (§5.2.7) và attributes (§5.2.8).
*Nội dung clause trả phí — không trích tên như thể đã đọc từ chuẩn.*
**INCOSE GtWR v4** (INCOSE-TP-2010-006-04, 2023) — **guidance của hội, không phải chuẩn**; miễn phí;
là nguồn của C1–C15, R1–R42 và A1–A49 ở trên.

**Mức bằng chứng: [CONVENTION].** Không có nghiên cứu nào chứng minh requirement viết theo C1–C15 thì
ít lỗi hơn.
