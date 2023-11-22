import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("123"),
  name: "Client 1",
  document: "Document 1",
  address: new Address(
    "Street 1",
    "Number 1",
    "Complement 1",
    "City 1",
    "State 1",
    "Zip Code 1"
  ),
  items: [
    new InvoiceItems({
      id: new Id("1"),
      name: "Product 1",
      price: 100,
    }),
    new InvoiceItems({
      id: new Id("2"),
      name: "Product 2",
      price: 200,
    }),
  ],
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find invoice use case unit test", () => {
  it("Should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "123",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
    expect(result.createdAt).toStrictEqual(invoice.createdAt);
  });
});
