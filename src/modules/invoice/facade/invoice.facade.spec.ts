import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

const input = {
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
    },
    {
      id: "2",
      name: "Product 2",
      price: 200,
    },
  ],
};

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

  it("Should create a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const result = await facade.generate(input);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: result.id },
      include: [InvoiceItemsModel],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.name).toBe(input.name);
    expect(invoiceDb.document).toBe(input.document);
    expect(invoiceDb.street).toBe(input.street);
    expect(invoiceDb.number).toBe(input.number);
    expect(invoiceDb.complement).toBe(input.complement);
    expect(invoiceDb.city).toBe(input.city);
    expect(invoiceDb.state).toBe(input.state);
    expect(invoiceDb.zipCode).toBe(input.zipCode);
    expect(invoiceDb.items.length).toBe(2);
  });

  it("Should find a invoice", async () => {
    // const repository = new InvoiceRepository();
    // const generateUsecase = new GenerateInvoiceUseCase(repository);
    // const findUsecase = new FindInvoiceUseCase(repository);
    // const facade = new InvoiceFacade({
    //   generateUsecase: generateUsecase,
    //   findUsecase: findUsecase,
    // });

    const facade = InvoiceFacadeFactory.create();
    const result = await facade.generate(input);

    const invoice = await facade.find({ id: result.id });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(result.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.street);
    expect(invoice.address.number).toBe(input.number);
    expect(invoice.address.complement).toBe(input.complement);
    expect(invoice.address.city).toBe(input.city);
    expect(invoice.address.state).toBe(input.state);
    expect(invoice.address.zipCode).toBe(input.zipCode);
    expect(invoice.items.length).toBe(2);
  });
});
