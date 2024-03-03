describe('Registration Form', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
      cy.get('button').contains('Register').click(); // 假设这是切换到注册表单的按钮
    });
  
    it('allows a user to register with email, password, username, and description', () => {
      cy.get('input[type="email"]').type('user@example.com');
      cy.get('input[type="password"]').type('SecurePassword123');
      cy.get('input[placeholder="Username"]').type('newuser');
      cy.get('textarea[placeholder="Description"]').type('This is a test user.');
      // 如果你的表单包含文件上传，这里是一个示例如何处理。你可能需要调整选择器以匹配你的实际DOM结构。
      // 假设有一个input可以上传文件，我们可以这样模拟文件上传（确保有这个文件在你的项目中或Cypress fixtures文件夹里）
      // cy.get('input[type="file"]').attachFile('path/to/your/avatar.jpg');
      // 提交表单
      cy.get('form').submit(); // 或者 cy.get('button').contains('Register').click(); 如果是通过按钮点击提交
  
      // 断言预期的结果，例如跳转到登录页面、显示成功消息等
      // 这里需要根据实际应用逻辑添加断言，例如：
      // cy.url().should('include', '/success'); // 假设成功注册后会跳转到某个页面
      // cy.get('.success-message').should('contain', 'Registration successful'); // 假设会显示成功消息
    });
  
    // 根据需要添加更多测试，例如测试输入验证、错误消息显示等
  });
  