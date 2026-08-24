# Design — [Tên hệ thống / tính năng]

**Trạng thái:** ideation | discussion | published | committed | abandoned
**Owner:** [ai chịu trách nhiệm cập nhật] · **Ngày:** YYYY-MM-DD
**Đọc bởi:** [ai đọc, để ra quyết định gì]

<!--
❗ ĐỌC TRƯỚC KHI ĐIỀN

1. KHÔNG CÓ CHUẨN NÀO CHO "LLD". IEEE Std 1016-2009 nói thẳng: "The demarcation between
   architecture, high-level and detailed design varies from system to system and is beyond the
   scope of this standard." Đừng nói với ai rằng tài liệu này theo một chuẩn LLD nào đó.

2. KHÔNG TÁCH HLD/LLD THÀNH 2 FILE. Mọi chuẩn đã kiểm (ECSS-E-ST-40C, DoD DI-IPSC-81435A,
   NASA NPR 7150.2) đều để thiết kế kiến trúc VÀ thiết kế chi tiết trong CÙNG một tài liệu,
   chia theo mốc review (PDR/CDR) chứ không chia theo file.

3. CÁC MỤC DƯỚI LÀ THỰC ĐƠN, KHÔNG PHẢI CHECKLIST. Xoá mục nào hệ thống này không có.
   Một mục để trống hoặc điền chữ rỗng làm hỏng tài liệu nhiều hơn là thiếu nó.
   IEEE 1016 §5.1: viewpoint "shall be used ... whenever APPLICABLE to the design subject".

4. DỪNG Ở ĐÂU (tiêu chí duy nhất tìm được có thể kiểm, từ ECSS-E-ST-40C Rev.1, normative):
   chi tiết hoá tới mức các đơn vị "can be coded, compiled, and tested", và mô tả interface đủ
   để "allow coding without requiring further information". Qua mức đó thì CODE là nguồn sự
   thật — viết thêm LLD là lãng phí và sẽ lệch khỏi code.
-->

---

## 1. Bối cảnh — cái gì đã có, cái gì đang đề xuất

> Tách bạch **[ĐANG CÓ]** và **[ĐỀ XUẤT]** ở mọi phát biểu. Trộn hai thứ này là nguồn gây hiểu sai
> số 1 của tài liệu thiết kế. Mọi phát biểu về code hiện tại phải trích `path/file.ts:120-134`.

## 2. Non-goals

Tài liệu này **cố tình không** giải quyết: …

## 3. Thành phần & phụ thuộc
*(IEEE 1016 Composition 5.3 · Dependency 5.5)*

## 4. Mô hình dữ liệu
*(Information viewpoint 5.6)* — schema, ràng buộc, index, chỉ số lượng dữ liệu dự kiến.

## 5. Interface / API contract
*(Interface viewpoint 5.8)* — với mỗi interface: kiểu, khuôn dạng, đơn vị, miền giá trị, độ chính
xác, ràng buộc thời gian/khối lượng/thứ tự, xử lý lỗi và khôi phục, đồng bộ hoá.
**Tiêu chí đủ:** người khác code được mà không phải hỏi thêm.

## 6. Luồng & trạng thái
*(Interaction 5.10 · State dynamics 5.11)* — sequence cho các đường đi chính; state machine nếu có
trạng thái tường minh. **Sơ đồ chỉ được tồn tại nếu nó cho thấy thứ văn xuôi không diễn đạt nổi.**

## 7. Xử lý lỗi
Mỗi chế độ hỏng: phát hiện bằng gì → phản ứng ra sao → ai được báo → phục hồi thế nào.
Bao gồm cả lỗi **âm thầm** (kết quả rỗng, exit 0 nhưng không làm gì) — không chỉ exception.

## 8. Đồng thời & tranh chấp
Cái gì chạy song song, dùng chung tài nguyên gì, khoá ra sao, deadlock/race đã cân nhắc chưa.

## 9. Tài nguyên & sức chứa
*(Resources viewpoint 5.13)* — CPU/RAM/đĩa/quota/rate limit. **Số phải có nguồn.**
Không có số đo thì ghi `[UNVERIFIED]` kèm cách đo, đừng bịa "1000 concurrent users".

## 10. Vận hành *(giữ nếu hệ thống cần — KHÔNG có chuẩn nào bắt buộc)*
- **Idempotency** — chạy lại hai lần thì sao?
- **Observability** — hỏng lúc 3 giờ sáng thì nhìn vào đâu?
- **Migration / rollback** — quay lui bằng cách nào, dữ liệu đã ghi xử lý sao?

> Ba mục này **không có chuẩn công bố nào chống lưng** — chúng là kỹ thuật tốt, không phải yêu cầu
> tuân thủ. Giữ vì hệ thống cần, đừng giữ vì template có.

## 11. Truy vết requirement → thiết kế → test

| Requirement | Thành phần | Test |
|---|---|---|
| REQ-001 | `src/…` | `…test.ts::…` |

*(ECSS bắt buộc ma trận truy vết xuôi + ngược trong tài liệu thiết kế; đây là quy ước mượn từ miền
hàng không vũ trụ — **tương tự, không phải bắt buộc tuân thủ** với dự án thường.)*

## 12. Rủi ro & điều chưa ngã ngũ
Rủi ro phải nêu **mức phơi nhiễm thật**. Bảng mà mọi dòng đều MEDIUM/MEDIUM thì xoá đi.

---

### Nguồn
IEEE Std 1016-2009 (12 design viewpoints; demarcation ngoài phạm vi) · ECSS-E-ST-40C Rev.1 Annex F
(SDD DRD, normative, tải tự do; tiêu chí dừng ở 5.5.2) · DoD DI-IPSC-81435A · NASA NPR 7150.2 SWE-111.

**Mức bằng chứng: [CONVENTION].** Không có nghiên cứu nào chứng minh cấu trúc này cho ra thiết kế
tốt hơn. ECSS/DoD/NASA thuộc miền an toàn-tới-tính-mạng và mua sắm quốc phòng — mượn cấu trúc của họ
là **loại suy, không phải tuân thủ**.
