# Decision Record — DR-NNN: [Tiêu đề ở thể khẳng định, vd "Dùng Postgres thay vì Mongo cho store đơn hàng"]

<!--
THANG 4 BẬC — chọn bậc theo quy mô quyết định, ĐỪNG mặc định dùng bậc cao nhất.
Thứ phân biệt các bậc là MỨC ĐỘ PHÂN TÍCH PHƯƠNG ÁN, không phải độ dài.

  Bậc 1 · Y-statement      1 câu.        Quyết định nhỏ, đảo ngược rẻ.
  Bậc 2 · ADR (Nygard)     5 mục.        Có hệ quả lâu dài, nhưng phương án hiển nhiên.
  Bậc 3 · MADR             + so sánh.    Có ≥2 phương án đáng cân nhắc thật.
  Bậc 4 · RFC              2 tầng.       Ảnh hưởng nhiều nhóm / khó đảo ngược.

Xoá các bậc không dùng. Giữ khối `Trạng thái` ở mọi bậc.
-->

**Trạng thái:** ideation | discussion | published | committed | abandoned
<!-- Lấy từ vòng đời RFD của Oxide. `committed` = tài liệu này mô tả hệ thống ĐANG CHẠY,
     không còn là ý tưởng. Chuẩn mực (IETF RFC 3, 1969): "timely rather than polished" —
     ra sớm kèm nhãn trạng thái đúng, đừng chờ hoàn hảo. -->
**Ngày:** YYYY-MM-DD · **Owner:** [tên người chịu trách nhiệm cập nhật]

---

## Bậc 1 — Y-statement (1 câu)

Trong bối cảnh **[use case / user story]**,
đối mặt **[mối lo / lực cản]**,
chúng tôi chọn **[phương án]**
để đạt **[thuộc tính chất lượng]**,
chấp nhận **[điều đánh đổi]**.

> ⚠️ Ô "chấp nhận" bắt buộc phải điền, nhưng điền ≠ đã cân nhắc thật.
> Nếu không nêu được một đánh đổi CỤ THỂ, quyết định này chưa chín — lên bậc 3.

---

## Bậc 2 — ADR (Nygard, 5 mục)

### Bối cảnh
Lực cản đang giằng co nhau là gì? Mô tả tình thế, **chưa nói giải pháp**.

### Quyết định
Chúng tôi sẽ… *(thể chủ động, dứt khoát)*

### Hệ quả
Cái gì trở nên dễ hơn, cái gì khó hơn **sau** quyết định này — cả tốt lẫn xấu.

---

## Bậc 3 — MADR (thêm phần so sánh phương án)

### Yếu tố dẫn dắt quyết định
- [Yếu tố 1 — vd ràng buộc vận hành, chi phí, kỹ năng đội]

### Các phương án đã cân nhắc
1. **[Phương án A]**
2. **[Phương án B]**
3. **[Không làm gì]** ← luôn liệt kê, để lộ chi phí của việc đứng yên

### Ưu / nhược từng phương án
**[Phương án A]**
- 👍 …
- 👎 …

### Kết quả
Chọn **[phương án]**, vì [lý do bám vào yếu tố dẫn dắt ở trên].

**Confirmation:** làm sao BIẾT quyết định này được tuân thủ trong thực tế?
*(test, lint rule, review checklist, cảnh báo runtime — nêu cơ chế cụ thể, không nói "sẽ review kỹ")*

**Người quyết định:** … · **Đã hỏi ý:** … · **Đã thông báo:** …

---

## Bậc 4 — RFC (tách 2 tầng, theo mẫu Rust RFC)

### Tóm tắt
Một đoạn.

### Động cơ
Đang giải quyết vấn đề gì? Kết quả mong đợi là gì?

### Giải thích tầng hướng dẫn (guide-level)
Trình bày như thể thứ này ĐÃ tồn tại và anh đang dạy một đồng nghiệp dùng nó.
Giới thiệu khái niệm mới, giải thích chủ yếu **bằng ví dụ**, nêu luôn thông báo lỗi mẫu /
cảnh báo deprecation / hướng dẫn migration nếu có.

### Giải thích tầng tham chiếu (reference-level)
Phần kỹ thuật. Chi tiết đủ để: rõ nó tương tác với các thành phần khác ra sao, rõ sẽ hiện
thực thế nào, và **mổ xẻ các ca biên bằng ví dụ** — quay lại chính các ví dụ ở tầng trên.

### Nhược điểm
**Vì sao KHÔNG nên làm việc này?** *(Bỏ trống mục này = tài liệu mất uy tín.)*

### Lý lẽ và các phương án khác
Vì sao thiết kế này tốt nhất trong không gian các thiết kế khả dĩ? Đã cân nhắc những thiết kế
nào khác và vì sao loại? **Tác động của việc KHÔNG làm gì cả là gì?**

### Tiền lệ
Ngôn ngữ / framework / hệ thống khác đã giải bài này ra sao? *(Được phép trả lời "không có" —
nhưng phải nói rõ là đã tìm.)*

### Câu hỏi chưa ngã ngũ
Cái gì cố tình để ngỏ, sẽ chốt ở đâu và khi nào.

---

## Nguồn của mẫu này

| Bậc | Nguồn | Ghi chú |
|---|---|---|
| Y-statement | Olaf Zimmermann | 5 ô; trích trong paper MADR (CEUR-WS Vol-2072) |
| ADR | Michael Nygard, 2011 | Thứ tự gốc: Title, Context, Decision, Status, Consequences. **Bản gốc KHÔNG có mục alternatives** |
| MADR | github.com/adr/madr | Bản *minimal* vẫn giữ Considered Options. v3.0.0 đổi tên thành "Markdown Any Decision Records" |
| RFC | rust-lang/rfcs `0000-template.md` | Drawbacks / Rationale-and-alternatives / Prior-art là quy ước xã hội, **không có máy nào chặn PR thiếu mục** |
| Trạng thái | Oxide RFD 1 + IETF RFC 3 (1969) | 6 trạng thái, không có trạng thái "draft" |

> **Mức bằng chứng:** đây là **quy ước ngành có nguồn sơ cấp**, không phải kết quả nghiên cứu đối chứng.
> Không có nghiên cứu nào chứng minh mẫu này cho ra quyết định tốt hơn.
> Thứ tự lập luận (problem-first / decision-first / narrative) hiện **không có bằng chứng** theo chiều nào — tự chọn theo nhà.
