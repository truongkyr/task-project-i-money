<template>
  <div class="row">
    <div class="container w-full">
      <div class="font-semibold text-xl text-dark bg-white p-5">
        <span class="text-center">
          Quản lý chi tiêu là tập hợp các hoạt động liên quan đến việc quản lý
          tiền bạc, tối ưu thu chi đồng thời thiết lập kế hoạch tiết kiệm trong
          dài hạn. Nếu việc quản lý chi tiêu tốt sẽ giúp bạn có nguồn tài chính
          ổn định điều khiển được dòng tiền, đồng thời làm chủ được tài sản, nắm
          bắt được cơ hội của chính mình. Từ đó, giúp bạn có thể nâng cao chất
          lượng mức sống và thoát khỏi những áp lực về các vấn đề tài chính.
          Thông thường, mọi người rất dễ gặp các vấn đề liên quan đến chi tiêu
          bởi đa phần chúng ta đều không hề suy nghĩ hay có bất kỳ tính toán về
          cách sử dụng tiền. Điều đó dần tạo nên một thói quen chi tiêu tùy ý và
          ngẫu hứng mà không tuân theo bất kỳ phương hướng cụ thể nào, dẫn đến
          hiện tượng mất kiểm soát trong chi tiêu. Bởi vậy, việc bạn cần phải
          làm là xác định rõ ràng những mục tiêu tài chính của bản thân, từ đó
          xây dựng lên một kế hoạch thực hiện chi tiết để giúp bạn hoàn thành
          những mục tiêu ấy. Hành động đó không chỉ giữ cho bạn sự tập trung
          nhất định, một mục tiêu cụ thể rõ ràng còn là nguồn động lực và thúc
          đẩy bạn mỗi ngày trên hành trình chinh phục những điều mình mong muốn.
          Có thể kể tên một số mục tiêu tài chính ngắn hạn như mua một chiếc
          điện thoại mới hay trả hết nợ ngân hàng,… hoặc thiết lập các mục tiêu
          dài hạn như có một cửa hàng nhỏ, lập gia đình, nghỉ hưu,…
        </span>
      </div>
      <div class="font-semibold text-xl bg-white border-x-4 text-center">
        <button type="submit" class="text-primary p-5">Hỗ trợ</button>
      </div>
    </div>
    <div class="row mt-8">
      <div class="flex items-center flex-none w-10 text-right leading-10 mr-4">
        <router-link class="flex" :to="{ name: 'Profile', params: {} }">
          <span class="flex-none w-10 mr-2">
            <i class="fa-solid fa-arrow-left text-2xl text-gray-500"></i>
          </span>
          <span class="text-gray-500 inline-block text-2xl" style="width: 66px"
            >Trở về</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>