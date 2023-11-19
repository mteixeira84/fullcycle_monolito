import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    });

    const input = {
      id: "123",
      name: "Client 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          invoiceId: "123",
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
          invoiceId: "123",
        },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      where: { id: "123" },
      include: [{ model: InvoiceItemsModel }],
    });

    expect(invoice).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
  });

  it("should find a invoice", async () => {
    // const repository = new InvoiceRepository();
    // const generateUsecase = new GenerateInvoiceUseCase(repository);
    // const findUsecase = new FindInvoiceUseCase(repository);
    // const facade = new InvoiceFacade({
    //   generateUsecase: generateUsecase,
    //   findUsecase: findUsecase,
    // });

    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "123",
      name: "Client 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          invoiceId: "123",
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
          invoiceId: "123",
        },
      ],
    };

    await facade.generate(input);

    const invoice = await facade.find({ id: "123" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.street);
    expect(invoice.address.number).toBe(input.number);
    expect(invoice.address.complement).toBe(input.complement);
    expect(invoice.address.city).toBe(input.city);
    expect(invoice.address.state).toBe(input.state);
    expect(invoice.address.zipCode).toBe(input.zipCode);
  });
});
