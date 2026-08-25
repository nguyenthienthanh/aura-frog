# Confluence Page Template

**Định dạng wiki-markup, dán thẳng vào Confluence.** Bản dành cho NGƯỜI đọc — bản AI đọc là
`TECH_SPEC.md` (TOON). Hai bản phải nói cùng một sự thật; lệch nhau là bug.

<!--
LUẬT ĐIỀN:
- Xoá mọi mục không áp dụng. Mục trống tệ hơn mục thiếu.
- Mỗi phát biểu về code phải trích `path/file.ts:120-134`. Không trích được ⇒ xoá.
- Mỗi con số phải có nguồn. Không đo được ⇒ ghi [UNVERIFIED] + cách đo. KHÔNG bịa.
- Tách rõ [ĐANG CÓ] và [ĐỀ XUẤT].
-->

---

h1. [Tên tính năng]

*Ticket:* [JIRA-…] | *Ngày:* [YYYY-MM-DD] | *Owner:* [tên] | *Trạng thái:* ideation / discussion / published / committed / abandoned

{info}
*Đọc bởi:* [ai đọc, để ra quyết định gì]
*Trạng thái* theo vòng đời RFD của Oxide — _committed_ nghĩa là trang này mô tả hệ thống ĐANG CHẠY,
không phải dự định. Không có trạng thái _draft_: ra sớm kèm nhãn đúng còn hơn giữ lại chờ hoàn hảo.
{info}

----

h2. Vấn đề

Hôm nay đang sai/thiếu cái gì, đo bằng gì. *Chưa nói giải pháp.*

h2. Non-goals

Cố tình KHÔNG làm: …

h2. Quyết định

Chúng tôi sẽ … *(thể chủ động, dứt khoát)*

h3. Các phương án đã cân nhắc

|| Phương án || Ưu || Nhược || Vì sao chọn / loại ||
| A | | | |
| B | | | |
| Không làm gì | | | |

{warning}
*Vì sao KHÔNG nên làm việc này?* — Bỏ trống mục này thì tài liệu mất uy tín. Nêu nhược điểm thật.
{warning}

----

h2. Thiết kế

Kiến trúc, thành phần, luồng dữ liệu. Sơ đồ *chỉ* được có nếu nó cho thấy thứ văn xuôi không diễn
đạt nổi — sơ đồ chép lại đoạn văn bên trên thì xoá.

h3. Interface / API

Với mỗi interface: kiểu, khuôn dạng, đơn vị, miền giá trị, ràng buộc thời gian, xử lý lỗi.
*Tiêu chí đủ:* người khác code được mà không phải hỏi thêm.

h3. Chế độ hỏng

|| Hỏng thế nào || Phát hiện bằng gì || Phản ứng || Ai được báo ||
| | | | |

Nhớ cả lỗi *âm thầm* — exit 0 nhưng không làm gì, payload rỗng — không chỉ exception.

----

h2. Tiêu chí thành công

Đo được, kèm cách đo. Chưa đo thì ghi `[UNVERIFIED] — sẽ đo bằng …`

h2. Kết quả kiểm thử

|| Chỉ số || Giá trị || Nguồn ||
| | | |

{note}
Chỉ điền số ĐÃ CHẠY THẬT. Bảng test toàn ✅ mà không ai chạy là thứ làm tài liệu mất giá trị nhanh nhất.
{note}

----

h2. Rủi ro

|| Rủi ro || Phơi nhiễm thật || Giảm thiểu ||
| | | |

Mọi dòng đều MEDIUM/MEDIUM ⇒ xoá cả bảng, nó không nói gì.

h2. Câu hỏi chưa ngã ngũ

Cái gì cố tình để ngỏ, chốt ở đâu, khi nào.

----

_Tạo bởi [Aura Frog|https://github.com/nguyenthienthanh/aura-frog] · Cập nhật: [YYYY-MM-DD]_
